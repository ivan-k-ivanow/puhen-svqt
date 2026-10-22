export default function AdminHeader() {
    return (
        <header className="admin-header">
            <div className="admin-nav-wrapper">
                <a href="/" className="logo">
                    <img src="/images/logo.png" alt="Пухен Свят лого"/>
                </a>
                <h1 className="admin-logo">Админ панел</h1>
                <nav className="admin-nav">
                    
                    <a href="/admin/products" className="admin-nav-btn">Админ панел</a>
                    <a href="/admin/products/create" className="admin-nav-btn">Добави продукт</a>
                    <form action="/admin/logout" method="POST">
                        <button type="submit" className="admin-nav-btn">Изход</button>
                    </form>
                   
                    <a href="/admin/login" className="admin-nav-btn">Вход</a>
                    
                </nav>

                <button className="hamburger" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

            </div>
        </header>
    );
}