import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import ProductTable from "../../components/admin/product-table/ProductTable";

export default function AdminProducts() {
    return (
        <>
            <div className="admin-page">
                <AdminHeader />
                <ProductTable />
            </div>
        </>
    );
}