const BASE_URL = `${import.meta.env.VITE_API_URL}/api/admin/orders`;

async function request(url, options = {}, fallbackMessage) {
    const response = await fetch(url, {
        credentials: 'include',
        ...options,
        headers: options.body
            ? { 'Content-Type': 'application/json', ...options.headers }
            : options.headers,
    });

    if (!response.ok) {
        let message = fallbackMessage;

        try {
            const data = await response.json();
            message = data.message || message;
        } catch {
            // Отговорът не е JSON – ползваме общото съобщение.
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export function getOrders() {
    return request(BASE_URL, {}, 'Грешка при зареждането на поръчките.');
}

export function getOrderById(id) {
    return request(`${BASE_URL}/${id}`, {}, 'Грешка при зареждането на поръчката.');
}

export function createOrder(order) {
    return request(
        BASE_URL,
        { method: 'POST', body: JSON.stringify(order) },
        'Грешка при създаването на поръчката.'
    );
}

export function updateOrder(id, order) {
    return request(
        `${BASE_URL}/${id}`,
        { method: 'PUT', body: JSON.stringify(order) },
        'Грешка при запазването на поръчката.'
    );
}

export function updateOrderStatus(id, status, trackingNumber) {
    return request(
        `${BASE_URL}/${id}/status`,
        { method: 'PATCH', body: JSON.stringify({ status, trackingNumber }) },
        'Грешка при смяната на статуса.'
    );
}

export function updateOrderPaid(id, isPaid) {
    return request(
        `${BASE_URL}/${id}/paid`,
        { method: 'PATCH', body: JSON.stringify({ isPaid }) },
        'Грешка при запазването на плащането.'
    );
}

export function deleteOrder(id) {
    return request(
        `${BASE_URL}/${id}`,
        { method: 'DELETE' },
        'Грешка при изтриването на поръчката.'
    );
}
