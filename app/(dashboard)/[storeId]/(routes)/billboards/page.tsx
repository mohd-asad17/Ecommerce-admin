import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";
import {format} from 'date-fns';

const BillboardPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const awaitedParams = await params;

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: awaitedParams.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMM do, yyy")
    }));

    return <div className="flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6">
            <BillboardClient data={formattedBillboards} />
        </div>
    </div>
}

export default BillboardPage;