import { useEffect, useMemo, useState } from "react";
import ProductCard from "./product-card/ProductCard";
import ProductFilters from "./product-filters.jsx/ProductFilters";
import Pagination from "./pagination/Pagination";
import "./Catalog.css";
import { getProducts } from "../../services/products";

const PER_PAGE = 12;

function productLabel(count) {
    return count === 1 ? "продукт" : "продукта";
}

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Unique categories with how many products each one has.
    const categories = useMemo(() => {
        const map = new Map();
        products.forEach((product) => {
            (product.categories ?? []).forEach((category) => {
                const entry = map.get(category.id);
                if (entry) {
                    entry.count += 1;
                } else {
                    map.set(category.id, { ...category, count: 1 });
                }
            });
        });
        return [...map.values()];
    }, [products]);

    const visibleProducts = useMemo(() => {
        let list =
            selectedCategory === "all"
                ? products
                : products.filter((product) =>
                      product.categories?.some(
                          (category) => category.id === selectedCategory
                      )
                  );

        if (sort) {
            list = [...list].sort((a, b) =>
                a.name.localeCompare(b.name, "bg")
            );
            if (sort === "za") list.reverse();
        }

        return list;
    }, [products, selectedCategory, sort]);

    const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const pageProducts = visibleProducts.slice(
        (currentPage - 1) * PER_PAGE,
        currentPage * PER_PAGE
    );

    const selectedCategoryName =
        categories.find((category) => category.id === selectedCategory)?.name;

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setPage(1);
    };

    const handleSortChange = (value) => {
        setSort(value);
        setPage(1);
    };

    const handlePageChange = (nextPage) => {
        setPage(nextPage);
        document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <section className="products" id="products">
            <div className="products-header">
                <h2>Нашите продукти</h2>

                <p>
                    Открийте ръчно изработени подаръци за
                    специалните моменти в живота.
                </p>
            </div>

            <div className="shop-bar">
                <ProductFilters
                    categories={categories}
                    totalCount={products.length}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                <div className="shop-meta">
                    <div className="shop-result">
                        <p className="shop-count">
                            <b>{visibleProducts.length}</b>{" "}
                            {productLabel(visibleProducts.length)}
                            {selectedCategoryName &&
                                ` в „${selectedCategoryName}“`}
                        </p>

                        {selectedCategory !== "all" && (
                            <button
                                type="button"
                                className="shop-clear"
                                onClick={() => handleCategoryChange("all")}
                            >
                                Изчисти филтъра
                            </button>
                        )}
                    </div>

                    <div className="shop-sort">
                        <label htmlFor="sort-by">Подреди по</label>
                        <span className="shop-select">
                            <select
                                id="sort-by"
                                value={sort}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="">Препоръчани</option>
                                <option value="az">Име: А – Я</option>
                                <option value="za">Име: Я – А</option>
                            </select>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            <div className="products-grid">
                {pageProducts.map((product) => (
                    <ProductCard product={product} key={product.id} />
                ))}
            </div>

            {!loading && visibleProducts.length === 0 && (
                <p className="products-empty">Няма продукти в тази категория.</p>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </section>
    );
}
