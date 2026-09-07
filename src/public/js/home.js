const productFilters = document.querySelectorAll('.product-filter');
const productsGrid = document.querySelector('.products-grid');

productFilters.forEach(button => {
    button.addEventListener('click', async () => {
        const categoryId = button.dataset.category;

        try {
            const url = categoryId
                ? `/filter?category=${categoryId}`
                : '/filter';

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to load products.');
            }

            const products = await response.json();

            renderProducts(products);

        } catch (error) {
            console.error(error);
        }
    });
});

function renderProducts(products) {
    if (!products.length) {
        productsGrid.innerHTML = `
            <p class="no-products">
                В момента няма налични продукти.
            </p>
        `;

        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <article class="product-card">

            <div class="product-image-container">
                ${
                    product.images.length
                        ? `<img src="${product.images[0].url}" alt="${product.name}" class="product-image">`
                        : ''
                }
            </div>

            <div class="product-info">

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.shortDescription ?? ''}
                </p>

                <p class="product-price">
                    ${product.price} €
                </p>

                <a href="/product/${product.slug}" class="product-button">
                    Виж продукта
                </a>

            </div>

        </article>
    `).join('');
}