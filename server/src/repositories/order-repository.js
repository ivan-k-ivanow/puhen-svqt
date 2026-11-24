import { prisma } from '../lib/prisma.js';

const listInclude = {
    items: true,
};

const detailsInclude = {
    items: {
        include: {
            product: {
                select: { slug: true },
            },
        },
    },
    history: {
        orderBy: { createdAt: 'desc' },
    },
};

// Броят нови поръчки за брояча в админ менюто (без архивираните).
async function countNewOrders() {
    return prisma.order.count({
        where: { status: 'NEW', archivedAt: null },
    });
}

async function getAllOrders() {
    return await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: listInclude,
    });
}

async function getOrderById(id) {
    return await prisma.order.findUnique({
        where: { id },
        include: detailsInclude,
    });
}

async function createOrder({ items, ...data }, historyMessage) {
    return await prisma.order.create({
        data: {
            ...data,
            items: { create: items },
            history: {
                create: { message: historyMessage, status: data.status ?? 'NEW' },
            },
        },
        include: detailsInclude,
    });
}

async function updateOrder(id, { items, ...data }, historyEntries) {
    return await prisma.order.update({
        where: { id },
        data: {
            ...data,
            // Продуктите се заменят изцяло с новия списък.
            ...(items && {
                items: {
                    deleteMany: {},
                    create: items,
                },
            }),
            ...(historyEntries.length > 0 && {
                history: { create: historyEntries },
            }),
        },
        include: detailsInclude,
    });
}

async function deleteOrder(id) {
    return await prisma.order.delete({
        where: { id },
    });
}

// Приключени поръчки със снимки, които още не са изтрити.
async function getOrdersForPhotoCleanup(cutoff) {
    return await prisma.order.findMany({
        where: {
            status: { in: ['DELIVERED', 'CANCELLED'] },
            updatedAt: { lt: cutoff },
            photosDeletedAt: null,
            channel: 'WEBSITE',
        },
        include: { items: true },
        take: 50,
    });
}

async function markPhotosDeleted(orderId, items) {
    return await prisma.$transaction([
        ...items.map(item =>
            prisma.orderItem.update({
                where: { id: item.id },
                data: { personalization: item.personalization ?? undefined },
            })
        ),
        prisma.order.update({
            where: { id: orderId },
            data: {
                photosDeletedAt: new Date(),
                history: { create: { message: 'Снимките на клиента са изтрити автоматично' } },
            },
        }),
    ]);
}

export default {
    countNewOrders,
    getOrdersForPhotoCleanup,
    markPhotosDeleted,
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};
