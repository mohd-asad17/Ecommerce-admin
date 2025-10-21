import prismadb from "@/lib/prismadb"
import { Productform } from "./components/product-form"

const ProductsPage = async ({
    params
} : {
    params : {
        productId: string,
        storeId: string
    }
}) => {

    const awaitedParams = await params;

    const products = await prismadb.product.findUnique({
        where: {
            id: awaitedParams.productId
        },
        include: {
            images: true
        }
    })

    const categories = await prismadb.category.findMany({
        where: {
            storeId: awaitedParams.storeId
        }
    })

    const size = await prismadb.size.findMany({
        where: {
            storeId: awaitedParams.storeId
        }
    })

    const colors = await prismadb.color.findMany({
        where: {
            storeId: awaitedParams.storeId
        }
    })
return <div className="flex-col">
    <div className="flex-1 items-center p-8 pt-6 justify-between">
        <Productform categories={categories} size={size} colors={colors} initialData={products}/>
    </div>
</div>
}

export default ProductsPage;