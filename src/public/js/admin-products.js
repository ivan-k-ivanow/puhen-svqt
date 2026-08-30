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