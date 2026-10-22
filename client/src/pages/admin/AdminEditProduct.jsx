import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import EditProduct from "../../components/admin/edit-product/EditProduct";

export default function AdminEditProduct() {
    return (

        <>
            <div className="admin-page">
                <AdminHeader />
                <EditProduct />
            </div>
        </>
    );
}