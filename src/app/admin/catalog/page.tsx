import { getAllCategories } from "@/actions/catalog"
// import { authOptions } from "@/app/api/auth/[...nextauth]/auth"
import AddCategory from "@/components/admin/add-category"
import AddProduct from "@/components/admin/add-product"
// import { getServerSession } from "next-auth"

export default async function AdminCatalogMainPage() {
    // const session = await getServerSession(authOptions)
    const categories = await getAllCategories()
    return (
        <>
            <div className="m-2 flex gap-2">
                <AddCategory categories={categories} />
                <AddProduct categories={categories} />
            </div>
        </>

    )
}
