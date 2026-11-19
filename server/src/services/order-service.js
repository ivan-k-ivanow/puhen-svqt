import orderRepository from '../repositories/order-repository.js';

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

function prepareItems(items) {
    return items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productId: item.productId || null,
    }));
}

function statusEntry(status, trackingNumber) {
    let message = `Статус: ${STATUS_LABELS[status]}`;

    if (status === 'SHIPPED' && trackingNumber) {
        message += ` · № ${trackingNumber}`;
    }

    return { message, status };
}

async function getAllOrders() {
    return await orderRepository.getAllOrders();
}

async function getOrderById(id) {
    return await orderRepository.getOrderById(id);
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

    return await orderRepository.updateOrder(
        id,
        {
            ...data,
            deadline: toDate(data.deadline),
            items,
            total: calculateTotal(items),
        },
        history
    );
}

async function updateOrderStatus(id, { status, trackingNumber }) {
    const current = await orderRepository.getOrderById(id);

    if (!current) {
        return null;
    }

    if (current.status === status) {
        return current;
    }

    const data = { status };

    // Товарителницата се пази, ако не е подадена нова.
    if (trackingNumber) {
        data.trackingNumber = trackingNumber;
    }

    return await orderRepository.updateOrder(id, data, [
        statusEntry(status, trackingNumber || current.trackingNumber),
    ]);
}

async function updateOrderPaid(id, isPaid) {
    const current = await orderRepository.getOrderById(id);

    if (!current) {
        return null;
    }

    if (current.isPaid === isPaid) {
        return current;
    }

    return await orderRepository.updateOrder(id, { isPaid }, [
        { message: isPaid ? 'Плащането е получено' : 'Плащането е отменено' },
    ]);
}

async function deleteOrder(id) {
    return await orderRepository.deleteOrder(id);
}

export default {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    updateOrderPaid,
    deleteOrder,
};
