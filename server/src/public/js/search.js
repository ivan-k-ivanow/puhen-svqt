const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');

let searchTimeout;


searchInput.addEventListener('input', () => {

    clearTimeout(searchTimeout);

    const query = searchInput.value.trim();

    if (!query) {
        hideSearchResults();
        return;
    }

    searchTimeout = setTimeout(() => {
        searchProducts(query);
    }, 300);

});


async function searchProducts(query) {

    try {

        const response = await fetch(
            `/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error('Search request failed.');
        }

        const products = await response.json();

        renderSearchResults(products);

    } catch (error) {

        console.error('SEARCH ERROR:', error);

    }

}


function renderSearchResults(products) {

    if (!products.length) {

        searchResults.innerHTML = `
            <div class="search-result">
                <span class="search-result-name">
                    Няма намерени продукти.
                </span>
            </div>
        `;

        searchResults.classList.remove('hidden');

        return;
    }


    searchResults.innerHTML = products
        .slice(0, 5)
        .map(product => {

            const image = product.images?.length
                ? `
                    <img
                        src="${product.images[0].url}"
                        alt="${product.name}"
                        class="search-result-image"
                    >
                `
                : '';

            return `
                <a
                    href="/product/${product.slug}"
                    class="search-result"
                >

                    ${image}

                    <span class="search-result-name">
                        ${product.name}
                    </span>

                </a>
            `;

        })
        .join('');


    searchResults.classList.remove('hidden');
}


function hideSearchResults() {
    searchResults.classList.add('hidden');
}


document.addEventListener('click', event => {

    if (!event.target.closest('.search-box')) {
        hideSearchResults();
    }

});