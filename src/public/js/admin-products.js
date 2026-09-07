document.querySelectorAll('.preview-remove-btn').forEach(button => {
    button.addEventListener('click', async () => {
        const imageId = button.dataset.imageId;

        try {
            const response = await fetch(`/admin/products/images/${imageId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete image');
            }

            button.closest('.preview-wrapper').remove();

        } catch (error) {
            console.error(error);
            alert('Снимката не може да бъде изтрита.');
        }
    });
});


// Handle product deletion

// Handle category deletion

const categoryDeleteButtons = document.querySelectorAll('.category-delete-btn');

categoryDeleteButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const categoryId = button.dataset.categoryId;

        if (!categoryId) {
            console.error('Category ID is missing.');
            return;
        }

        const confirmed = confirm('Сигурни ли сте, че искате да изтриете тази категория?');

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/admin/categories/delete/${categoryId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete category.');
            }

            button.closest('.category-item').remove();

        } catch (error) {
            console.error(error);
            alert('Възникна грешка при изтриването на категорията.');
        }
    });
});