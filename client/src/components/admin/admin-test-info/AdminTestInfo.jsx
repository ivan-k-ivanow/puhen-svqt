import './AdminTestInfo.css';

export default function AdminTestInfo() {
    return (
        <section className="admin-test-info">
            <h3>Информация за тестване</h3>

            <p>
                Проектът е публикуван онлайн и съдържа реални продукти
                от каталога на „Пухен Свят“.
            </p>

            <div className="admin-test-credentials">
                <h4>Данни за достъп</h4>

                <p>
                    <strong>Имейл:</strong>{' '}
                    <span>softuni@test.com</span>
                </p>

                <p>
                    <strong>Парола:</strong>{' '}
                    <span>softunitest1234</span>
                </p>
            </div>

            <div className="admin-test-warning">
                <strong>Важно!</strong>
                <p>
                    Моля, не редактирайте и не изтривайте съществуващите
                    продукти. За тестване на добавяне, редактиране и
                    изтриване създайте собствен тестов продукт и
                    извършвайте промените само върху него.
                    <br />
                    При първото отваряне на сайта 
                    е възможно зареждането да отнеме 10–30 секунди, 
                    докато backend сървърът се активира. 
                    Това се дължи на използването на безплатния план на Render.
                </p>
            </div>

            <p className="admin-test-thanks">
                Благодарим за отделеното време!
            </p>
        </section>
    );
}