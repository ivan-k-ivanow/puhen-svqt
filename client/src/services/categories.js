export async function getCategories() {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/categories`,
        { credentials: "include" }
    );

    if (!response.ok) {
        throw new Error("Could not load categories.");
    }

    return response.json();
}


export async function createCategory(name) {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/categories/create`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        }
    );

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Could not create category.");
    }

    return response.json();
}


export async function deleteCategory(id) {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/categories/delete/${id}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    if (!response.ok) {
        const responseBody = await response.text();
        let errorMessage = `Could not delete category (HTTP ${response.status}).`;

        if (responseBody) {
            try {
                const data = JSON.parse(responseBody);
                errorMessage = data.error || data.message || errorMessage;
            } catch {
                errorMessage = responseBody;
            }
        }

        throw new Error(errorMessage);
    }
}