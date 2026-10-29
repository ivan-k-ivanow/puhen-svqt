export async function getProducts() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Грешка при зареждането на продуктите.');
    }

    return response.json();
}


export async function getProductBySlug(slug) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${slug}`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Грешка при зареждането на продукта.');
    }

    return response.json();
}


export async function getSimilarProducts(slug) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${slug}/similar`);

    if (!response.ok) {
        throw new Error('Грешка при зареждането на подобните продукти.');
    }

    return response.json();
}


export async function getProductById(productId) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${productId}`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Грешка при зареждането на продукта.');
    }

    return response.json();
}

export async function createProduct(formData) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Грешка при създаването на продукта.');
    }

    return response.json();
}


export async function updateProduct(productId, formData) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${productId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Грешка при запазването на продукта.');
    }

    return response.json();
}


export async function reorderProducts(productIds) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/reorder`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productIds })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Грешка при запазването на реда.');
    }

    return response.json();
}


export async function deleteProduct(productId) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Грешка при изтриването на продукта.');
    }

}