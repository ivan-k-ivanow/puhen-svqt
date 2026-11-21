// Изпраща заявка за поръчка от сайта (със снимките за персонализация).
export async function submitWebsiteOrder(data, photos) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));

    for (const { fieldId, file } of photos) {
        formData.append(`photos_${fieldId}`, file);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        body: formData,
    });

    let body = null;

    try {
        body = await response.json();
    } catch {
        // Няма JSON отговор.
    }

    if (!response.ok) {
        throw new Error(body?.message || 'Заявката не беше изпратена. Опитайте отново.');
    }

    return body;
}
