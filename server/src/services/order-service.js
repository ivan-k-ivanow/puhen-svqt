import orderRepository from '../repositories/order-repository.js';
import productRepository from '../repositories/product-repository.js';
import orderPhotoService from './order-photo-service.js';
import { randomUUID } from 'node:crypto';

const STATUS_LABELS = {
    NEW: 'Нова',
    CONFIRMED: 'Потвърдена',
    IN_PROGRESS: 'В изработка',
    READY: 'Готова',
    SHIPPED: 'Изпратена',
    DELIVERED: 'Доставена',
    CANCELLED: 'Отказана',
};

function calculateTotal(items) {
    const total = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
    );

    return Math.round(total * 100) / 100;
}

function toDate(value) {
    return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

// Пазим само пътя и името на снимките – временните линкове не се записват.
function cleanPersonalization(personalization) {
    if (!Array.isArray(personalization) || personalization.length === 0) {
        return undefined;
    }

    return personalization.map(entry => ({
        fieldId: entry.fieldId ?? null,
        label: entry.label,
        type: entry.type,
        value: entry.type === 'PHOTO' && Array.isArray(entry.value)
            ? entry.value.map(photo => ({ path: photo.path ?? null, name: photo.name ?? null }))
            : entry.value,
    }));
}

function prepareItems(items) {
    return items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productId: item.productId || null,
        personalization: cleanPersonalization(item.personalization),
    }));
}

function photoPaths(order) {
    return (order.items ?? []).flatMap(item =>
        (Array.isArray(item.personalization) ? item.personalization : [])
            .filter(entry => entry.type === 'PHOTO' && Array.isArray(entry.value))
            .flatMap(entry => entry.value.map(photo => photo.path).filter(Boolean))
    );
}

// Добавя временни линкове към снимките, за да се виждат в админа.
async function withPhotoLinks(order) {
    if (!order) {
        return order;
    }

    const items = await Promise.all(
        order.items.map(async item => {
            if (!Array.isArray(item.personalization)) {
                return item;
            }

            const personalization = await Promise.all(
                item.personalization.map(async entry => {
                    if (entry.type !== 'PHOTO' || !Array.isArray(entry.value)) {
                        return entry;
                    }

                    const value = await Promise.all(
                        entry.value.map(async photo => {
                            if (!photo.path) {
                                return photo;
                            }

                            try {
                                return { ...photo, ...(await orderPhotoService.createPhotoLinks(photo)) };
                            } catch (error) {
                                console.error('Error creating photo link:', error);
                                return photo;
                            }
                        })
                    );

                    return { ...entry, value };
                })
            );

            return { ...item, personalization };
        })
    );

    return { ...order, items };
}

function statusEntry(status, trackingNumber) {
    let message = `Статус: ${STATUS_LABELS[status]}`;

    if (status === 'SHIPPED' && trackingNumber) {
        message += ` · № ${trackingNumber}`;
    }

    return { message, status };
}

async function countNewOrders() {
    return orderRepository.countNewOrders();
}

async function getAllOrders() {
    return await orderRepository.getAllOrders();
}

async function getOrderById(id) {
    return await withPhotoLinks(await orderRepository.getOrderById(id));
}

async function createOrder(data) {
    const items = prepareItems(data.items);

    return await orderRepository.createOrder(
        {
            ...data,
            deadline: toDate(data.deadline),
            items,
            total: calculateTotal(items),
        },
        'Поръчката е създадена'
    );
}

async function updateOrder(id, data) {
    const current = await orderRepository.getOrderById(id);

    if (!current) {
        return null;
    }

    const items = prepareItems(data.items);
    const history = [{ message: 'Поръчката е редактирана' }];

    if (data.status !== current.status) {
        history.push(statusEntry(data.status, data.trackingNumber));
    }

    if (data.isPaid !== current.isPaid) {
        history.push({
            message: data.isPaid ? 'Плащането е получено' : 'Плащането е отменено',
        });
    }

    return await withPhotoLinks(await orderRepository.updateOrder(
        id,
        {
            ...data,
            deadline: toDate(data.deadline),
            items,
            total: calculateTotal(items),
        },
        history
    ));
}

async function updateOrderStatus(id, { status, trackingNumber }) {
    const current = await orderRepository.getOrderById(id);

    if (!current) {
        return null;
    }

    if (current.status === status) {
        return await withPhotoLinks(current);
    }

    const data = { status };

    // Товарителницата се пази, ако не е подадена нова.
    if (trackingNumber) {
        data.trackingNumber = trackingNumber;
    }

    return await withPhotoLinks(await orderRepository.updateOrder(id, data, [
        statusEntry(status, trackingNumber || current.trackingNumber),
    ]));
}

async function updateOrderPaid(id, isPaid) {
    const current = await orderRepository.getOrderById(id);

    if (!current) {
        return null;
    }

    if (current.isPaid === isPaid) {
        return await withPhotoLinks(current);
    }

    return await withPhotoLinks(await orderRepository.updateOrder(id, { isPaid }, [
        { message: isPaid ? 'Плащането е получено' : 'Плащането е отменено' },
    ]));
}

// „Изтрий“ в админа само архивира – поръчката остава в базата.
async function archiveOrder(id, by) {
    const current = await orderRepository.getOrderById(id);

    if (!current) {
        return null;
    }

    if (current.archivedAt) {
        return await withPhotoLinks(current);
    }

    return await withPhotoLinks(await orderRepository.updateOrder(
        id,
        { archivedAt: new Date(), archivedBy: by ?? null },
        [{ message: by ? `Поръчката е архивирана от ${by}` : 'Поръчката е архивирана' }]
    ));
}

async function restoreOrder(id, by) {
    const current = await orderRepository.getOrderById(id);

    if (!current) {
        return null;
    }

    if (!current.archivedAt) {
        return await withPhotoLinks(current);
    }

    return await withPhotoLinks(await orderRepository.updateOrder(
        id,
        { archivedAt: null, archivedBy: null },
        [{ message: by ? `Поръчката е възстановена от ${by}` : 'Поръчката е възстановена' }]
    ));
}

// Окончателно изтриване – само за вече архивирани поръчки (например тестови).
async function deleteOrder(id) {
    const order = await orderRepository.getOrderById(id);

    if (order && !order.archivedAt) {
        throw new OrderNotArchivedError();
    }

    const result = await orderRepository.deleteOrder(id);

    if (order && !order.photosDeletedAt) {
        try {
            await orderPhotoService.removeOrderPhotos(photoPaths(order));
        } catch (error) {
            console.error('Error removing order photos:', error);
        }
    }

    return result;
}

// ---------- Поръчка от сайта ----------

export class OrderValidationError extends Error {}

// Окончателно се трие само архивирана поръчка.
export class OrderNotArchivedError extends Error {
    constructor() {
        super('Първо архивирайте поръчката.');
    }
}

function checkPersonalization(fields, values, filesByField) {
    for (const field of fields) {
        const value = (values[field.id] ?? '').trim();
        const files = filesByField[field.id] ?? [];

        if (field.type === 'PHOTO') {
            if (field.required && files.length === 0) {
                throw new OrderValidationError(`Качете снимка за „${field.label}“.`);
            }

            if (files.length > (field.maxFiles ?? 1)) {
                throw new OrderValidationError(`„${field.label}“: до ${field.maxFiles ?? 1} снимки.`);
            }

            continue;
        }

        if (field.required && !value) {
            throw new OrderValidationError(`Попълнете „${field.label}“.`);
        }

        if (!value) {
            continue;
        }

        if (field.maxLength && value.length > field.maxLength) {
            throw new OrderValidationError(`„${field.label}“: до ${field.maxLength} символа.`);
        }

        if (field.type === 'DATE' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new OrderValidationError(`„${field.label}“: невалидна дата.`);
        }

        if (field.type === 'CHOICE' && !field.options.includes(value)) {
            throw new OrderValidationError(`„${field.label}“: изберете от вариантите.`);
        }
    }
}

async function createWebsiteOrder(data, files) {
    const product = await productRepository.getProductById(data.productId);

    if (!product || !product.isActive) {
        throw new OrderValidationError('Продуктът не е наличен.');
    }

    // Снимките пристигат като photos_<id на полето>.
    const fieldIds = new Set(product.fields.map(field => field.id));
    const filesByField = {};

    for (const file of files) {
        const fieldId = file.fieldname.replace(/^photos_/, '');

        if (!file.fieldname.startsWith('photos_') || !fieldIds.has(fieldId)) {
            throw new OrderValidationError('Невалидна снимка.');
        }

        (filesByField[fieldId] ??= []).push(file);
    }

    checkPersonalization(product.fields, data.personalization, filesByField);

    const folder = `orders/${new Date().toISOString().slice(0, 10)}-${randomUUID()}`;
    const uploadedPaths = [];

    try {
        const personalization = [];

        for (const field of product.fields) {
            if (field.type === 'PHOTO') {
                const photos = [];

                for (const file of filesByField[field.id] ?? []) {
                    const photo = await orderPhotoService.uploadOrderPhoto(file, folder);
                    uploadedPaths.push(photo.path);
                    photos.push(photo);
                }

                if (photos.length > 0) {
                    personalization.push({ fieldId: field.id, label: field.label, type: field.type, value: photos });
                }

                continue;
            }

            const value = (data.personalization[field.id] ?? '').trim();

            if (value) {
                personalization.push({ fieldId: field.id, label: field.label, type: field.type, value });
            }
        }

        const unitPrice = Number(product.price) || 0;
        const items = [{
            productId: product.id,
            name: product.name,
            quantity: data.quantity,
            unitPrice,
            personalization: personalization.length > 0 ? personalization : undefined,
        }];

        const order = await orderRepository.createOrder(
            {
                status: 'NEW',
                channel: 'WEBSITE',
                courier: 'ECONT',
                paymentMethod: 'CASH_ON_DELIVERY',
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                customerEmail: data.customerEmail,
                contactMethod: data.contactMethod,
                deliveryAddress: `${data.city}, ${data.office}`,
                deadline: toDate(data.deadline),
                notes: data.notes,
                substitutionConsent: data.substitutionConsent,
                privacyAcceptedAt: new Date(),
                attribution: data.attribution && Object.keys(data.attribution).length > 0 ? data.attribution : undefined,
                items,
                total: calculateTotal(items),
            },
            'Заявката е изпратена от сайта'
        );

        return order;
    } catch (error) {
        try {
            await orderPhotoService.removeOrderPhotos(uploadedPaths);
        } catch (removeError) {
            console.error('Error cleaning up order photos:', removeError);
        }

        throw error;
    }
}

// Изтрива снимките на клиентите 30 дни след като поръчката е приключила.
const PHOTO_RETENTION_DAYS = 30;

async function cleanupOldOrderPhotos() {
    const cutoff = new Date(Date.now() - PHOTO_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const orders = await orderRepository.getOrdersForPhotoCleanup(cutoff);
    let removed = 0;

    for (const order of orders) {
        const paths = photoPaths(order);

        try {
            await orderPhotoService.removeOrderPhotos(paths);

            const items = order.items.map(item => ({
                id: item.id,
                personalization: Array.isArray(item.personalization)
                    ? item.personalization.map(entry => (
                        entry.type === 'PHOTO'
                            ? { ...entry, value: [], deleted: true }
                            : entry
                    ))
                    : item.personalization,
            }));

            await orderRepository.markPhotosDeleted(order.id, items);
            removed += paths.length;
        } catch (error) {
            console.error(`Error cleaning photos for order ${order.id}:`, error);
        }
    }

    return removed;
}

export default {
    countNewOrders,
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    updateOrderPaid,
    archiveOrder,
    restoreOrder,
    deleteOrder,
    createWebsiteOrder,
    cleanupOldOrderPhotos,
};
