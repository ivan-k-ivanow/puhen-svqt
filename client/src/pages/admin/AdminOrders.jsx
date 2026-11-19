import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import OrderList from "../../components/admin/orders/order-list/OrderList";

export default function AdminOrders() {
    return (
        <div className="admin-page">
            <AdminHeader />
            <OrderList />
        </div>
    );
}
