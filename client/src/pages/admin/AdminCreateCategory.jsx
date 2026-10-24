import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import CreateCategoryForm from "../../components/admin/create-category/CreateCategory";



export default function AdminCreateCategory() {
    return (
        <>
            <div className="admin-page">
                <AdminHeader />
                <CreateCategoryForm />
            </div>
        </>
    );
}