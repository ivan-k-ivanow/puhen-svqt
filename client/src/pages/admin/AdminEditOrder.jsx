import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import OrderForm from "../../components/admin/orders/order-form/OrderForm";
import { getOrderById } from "../../services/orders";

export default function AdminEditOrder() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getOrderById(id)
            .then(setOrder)
            .catch(err => setError(err.message));
    }, [id]);

    return (
        <div className="admin-page">
            <AdminHeader />

            {order && <OrderForm key={order.id} order={order} />}

            {!order && (
                <div className="orders-page">
                    {error ? (
                        <>
                            <Link to="/admin/orders" className="orders-back">← Всички поръчки</Link>
                            <p className="orders-message orders-message--error">{error}</p>
                        </>
                    ) : (
                        <p>Зареждане...</p>
                    )}
                </div>
            )}
        </div>
    );
}
