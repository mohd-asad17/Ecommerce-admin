import prismadb from "@/lib/prismadb"
import { Billboardform } from "./components/billboard-form"

const BillboardPage = async ({
    params
} : {
    params : {
        billboardId: string
    }
}) => {

    const awaitedParams = await params;

    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: awaitedParams.billboardId
        }
    })

return <div className="flex-col">
    <div className="flex-1 items-center p-8 pt-6 justify-between">
        <Billboardform initialData={billboard}/>
    </div>
</div>
}

export default BillboardPage;