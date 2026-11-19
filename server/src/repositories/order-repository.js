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

export default {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};
