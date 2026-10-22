import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import CreateProduct from "../../components/admin/create-product/CreateProduct";



export default function AdminCreateProduct() {
    return (
        <>
            <div className="admin-page">
                <AdminHeader />
                <CreateProduct />
            </div>
        </>
    );
}