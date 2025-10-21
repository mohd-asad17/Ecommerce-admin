import prismadb from "@/lib/prismadb";
import { ColorClient } from "./components/client";
import { ColorColumn } from "./components/columns";
import {format} from 'date-fns';

const ColorsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const awaitedParams = await params;

    const colors = await prismadb.color.findMany({
        where: {
            storeId: awaitedParams.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedColors: ColorColumn[] = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMM do, yyy")
    }));

    return <div className="flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6">
            <ColorClient data={formattedColors} />
        </div>
    </div>
}

export default ColorsPage;