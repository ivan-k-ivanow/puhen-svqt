import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import OrderDetails from "../../components/admin/orders/order-details/OrderDetails";

export default function AdminOrder() {
    return (
        <div className="admin-page">
            <AdminHeader />
            <OrderDetails />
        </div>
    );
}
