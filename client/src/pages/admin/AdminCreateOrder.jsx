import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import OrderForm from "../../components/admin/orders/order-form/OrderForm";

export default function AdminCreateOrder() {
    return (
        <div className="admin-page">
            <AdminHeader />
            <OrderForm />
        </div>
    );
}
