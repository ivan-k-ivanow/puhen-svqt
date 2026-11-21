import { Router } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import orderService, { OrderValidationError } from '../services/order-service.js';
import { websiteOrderSchema } from '../schemas/order-schema.js';
import { rateLimit } from '../middlewares/rate-limit-middleware.js';
import metaCapiService from '../services/meta-capi-service.js';

const orderController = Router();

// Снимките от клиентите: до 10 файла по 10 MB.
const uploadPhotos = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 10 },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
            callback(null, true);
        } else {
            callback(new OrderValidationError('Може да качвате само снимки.'));
        }
    },
});

const limitOrders = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: 'Изпратихте твърде много заявки. Опитайте отново след малко.',
});

function handleUpload(req, res, next) {
    uploadPhotos.any()(req, res, (error) => {
        if (!error) {
            return next();
        }

        const message = error.code === 'LIMIT_FILE_SIZE'
            ? 'Снимката е твърде голяма (до 10 MB).'
            : error.code === 'LIMIT_FILE_COUNT'
                ? 'Твърде много снимки.'
                : error.message || 'Грешка при качването на снимките.';

        return res.status(400).json({ message });
    });
}

orderController.post('/', limitOrders, handleUpload, async (req, res) => {
    try {
        let body;

        try {
            body = JSON.parse(req.body.data ?? '{}');
        } catch {
            return res.status(400).json({ message: 'Невалидни данни.' });
        }

        const data = websiteOrderSchema.parse(body);
        const order = await orderService.createWebsiteOrder(data, req.files ?? []);

        // Изпращаме Purchase към Meta на заден план – клиентът не чака.
        metaCapiService
            .sendPurchase(order, {
                ip: req.ip,
                userAgent: req.get('user-agent'),
                url: req.get('referer'),
            })
            .catch(error => console.error('Meta CAPI error:', error.message));

        return res.status(201).json({ id: order.id, number: order.number });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: error.issues[0]?.message || 'Невалидни данни.' });
        }

        if (error instanceof OrderValidationError) {
            return res.status(400).json({ message: error.message });
        }

        console.error('Error creating website order:', error);

        return res.status(500).json({
            message: 'Заявката не беше изпратена. Опитайте отново или ни пишете в Instagram.',
        });
    }
});

export default orderController;
