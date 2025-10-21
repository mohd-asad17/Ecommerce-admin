import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import {  ProductColumn } from "./components/columns";
import {format} from 'date-fns';
import { formatter } from "@/lib/utils";

const ProductsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    const awaitedParams = await params;
    const products = await prismadb.product.findMany({
        where: {
            storeId: awaitedParams.storeId
        },
        include: {
            category: true,
            sizes: true,
            colors: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isArchived: item.isArchived,
        isFeatured: item.isFeatured,
        price: formatter.format(item.price),
        category: item.category.name,
        sizes: item.sizes.name,
        colors: item.colors.name,
        createdAt: format(item.createdAt, "MMM do, yyy")
    }));

    return <div className="flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6">
            <ProductClient data={formattedProducts} />
        </div>
    </div>
}

export default ProductsPage;