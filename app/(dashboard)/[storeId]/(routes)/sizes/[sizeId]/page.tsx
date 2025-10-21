import prismadb from "@/lib/prismadb"
import { Sizeform } from "./components/size-form"

const SizePage = async ({
    params
} : {
    params : {
        sizeId: string
    }
}) => {

    const awaitedParams = await params;

    const size = await prismadb.size.findUnique({
        where: {
            id: awaitedParams.sizeId
        }
    })

return <div className="flex-col">
    <div className="flex-1 items-center p-8 pt-6 justify-between">
        <Sizeform initialData={size}/>
    </div>
</div>
}

export default SizePage;