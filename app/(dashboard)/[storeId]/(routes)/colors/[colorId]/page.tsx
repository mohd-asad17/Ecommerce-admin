import prismadb from "@/lib/prismadb"
import { Colorsform } from "./components/color-form"

const ColorsPage = async ({
    params
} : {
    params : {
        colorId: string
    }
}) => {

    const awaitedParams = await params;

    const color = await prismadb.color.findUnique({
        where: {
            id: awaitedParams.colorId
        }
    })

return <div className="flex-col">
    <div className="flex-1 items-center p-8 pt-6 justify-between">
        <Colorsform initialData={color}/>
    </div>
</div>
}

export default ColorsPage;