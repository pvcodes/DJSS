import { getAllCategories } from "@/actions/catalog";
import AddCategory from "@/components/admin/add-category";
import AddProduct from "@/components/admin/add-product";

export default async function AdminCatalogMainPage() {
    const categories = await getAllCategories();

    return (
        <div className="m-2 flex flex-col gap-4 sm:flex-row sm:gap-2">
            <AddCategory categories={categories} />
            <AddProduct categories={categories} />
        </div>
    );
}