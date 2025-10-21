import prismadb from "@/lib/prismadb";
import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/columns";
import {format} from 'date-fns';

const SizePage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const awaitedParams = await params;

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: awaitedParams.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedSize: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMM do, yyy")
    }));

    return <div className="flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6">
            <SizeClient data={formattedSize} />
        </div>
    </div>
}

export default SizePage;