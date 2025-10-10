import prismadb from "@/lib/prismadb"
import { Categoryform } from "./components/category-form"

const CategoriesPage = async ({
    params
} : {
    params : {
        categoryId: string,
        storeId: string
    }
}) => {

    const awaitedParams = await params;

    const category = await prismadb.category.findUnique({
        where: {
            id: awaitedParams.categoryId
        }
    })

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: awaitedParams.storeId
        }
    })

return <div className="flex-col">
    <div className="flex-1 items-center p-8 pt-6 justify-between">
        <Categoryform billboards={billboards} initialData={category}/>
    </div>
</div>
}

export default CategoriesPage;