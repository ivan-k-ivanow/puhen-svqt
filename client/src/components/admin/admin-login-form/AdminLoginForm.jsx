export default function AdminLoginForm() {
    return (
        <section id="login" className="admin-section active">
            <h2>Админ вход</h2>
            <form id="login-form" action="/admin/login" method="POST" className="admin-form">
                <input type="email" name="email" placeholder="Имейл" required />
                <input type="password" name="password" placeholder="Парола" required />
                <button type="submit">Вход</button>
            </form>

        </section>
    );
}