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

const deleteButtons = document.querySelectorAll('.delete-product');

deleteButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.dataset.id;

        const confirmed = confirm('Сигурни ли сте, че искате да изтриете този продукт?');

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/admin/products/${productId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete product.');
            }

            button.closest('.admin-product').remove();

        } catch (error) {
            console.error(error);
            alert('Възникна грешка при изтриването на продукта.');
        }
    });
});