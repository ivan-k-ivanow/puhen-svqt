import { Router } from 'express';
import { ZodError } from 'zod';
import orderService, { OrderNotArchivedError } from '../services/order-service.js';
import {
    createOrderSchema,
    updateOrderSchema,
    updateOrderStatusSchema,
    updateOrderPaidSchema,
} from '../schemas/order-schema.js';

const adminOrdersController = Router();

// Връща първото съобщение от валидацията, за да го покажем във формата.
function sendError(res, error, fallbackMessage) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: error.issues[0]?.message || 'Невалидни данни.',
        });
    }

    console.error(fallbackMessage, error);

    return res.status(500).json({ message: fallbackMessage });
}

adminOrdersController.get('/', async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();

        return res.json(orders);
    } catch (error) {
        return sendError(res, error, 'Грешка при зареждането на поръчките.');
    }
});

adminOrdersController.get('/:id', async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Поръчката не е намерена.' });
        }

        return res.json(order);
    } catch (error) {
        return sendError(res, error, 'Грешка при зареждането на поръчката.');
    }
});

adminOrdersController.post('/', async (req, res) => {
    try {
        const data = createOrderSchema.parse(req.body);
        const order = await orderService.createOrder(data);

        return res.status(201).json(order);
    } catch (error) {
        return sendError(res, error, 'Грешка при създаването на поръчката.');
    }
});

adminOrdersController.put('/:id', async (req, res) => {
    try {
        const data = updateOrderSchema.parse(req.body);
        const order = await orderService.updateOrder(req.params.id, data);

        if (!order) {
            return res.status(404).json({ message: 'Поръчката не е намерена.' });
        }

        return res.json(order);
    } catch (error) {
        return sendError(res, error, 'Грешка при редактирането на поръчката.');
    }
});

adminOrdersController.patch('/:id/status', async (req, res) => {
    try {
        const data = updateOrderStatusSchema.parse(req.body);
        const order = await orderService.updateOrderStatus(req.params.id, data);

        if (!order) {
            return res.status(404).json({ message: 'Поръчката не е намерена.' });
        }

        return res.json(order);
    } catch (error) {
        return sendError(res, error, 'Грешка при смяната на статуса.');
    }
});

adminOrdersController.patch('/:id/paid', async (req, res) => {
    try {
        const { isPaid } = updateOrderPaidSchema.parse(req.body);
        const order = await orderService.updateOrderPaid(req.params.id, isPaid);

        if (!order) {
            return res.status(404).json({ message: 'Поръчката не е намерена.' });
        }

        return res.json(order);
    } catch (error) {
        return sendError(res, error, 'Грешка при запазването на плащането.');
    }
});

// „Изтрий“ в таблицата – архивира поръчката (може да се върне).
adminOrdersController.post('/:id/archive', async (req, res) => {
    try {
        const order = await orderService.archiveOrder(req.params.id, req.user?.email);

        if (!order) {
            return res.status(404).json({ message: 'Поръчката не е намерена.' });
        }

        return res.json(order);
    } catch (error) {
        return sendError(res, error, 'Грешка при архивирането на поръчката.');
    }
});

adminOrdersController.post('/:id/restore', async (req, res) => {
    try {
        const order = await orderService.restoreOrder(req.params.id, req.user?.email);

        if (!order) {
            return res.status(404).json({ message: 'Поръчката не е намерена.' });
        }

        return res.json(order);
    } catch (error) {
        return sendError(res, error, 'Грешка при възстановяването на поръчката.');
    }
});

// Окончателно изтриване – само на архивирана поръчка.
adminOrdersController.delete('/:id', async (req, res) => {
    try {
        await orderService.deleteOrder(req.params.id);

        return res.status(204).end();
    } catch (error) {
        if (error instanceof OrderNotArchivedError) {
            return res.status(400).json({ message: error.message });
        }

        return sendError(res, error, 'Грешка при изтриването на поръчката.');
    }
});

export default adminOrdersController;
