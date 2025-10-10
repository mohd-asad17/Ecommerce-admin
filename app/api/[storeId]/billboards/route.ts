import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params} : {params : { storeId : string}} 
) {
    try{
        const { userId } = await auth();
        const body = await req.json();

        const awaitedParams = await params;

        if(!userId){
            return new NextResponse("Unauthenticated", {status:401});
        }

        const { label, imageUrl } = body;

        if(!label){
            return new NextResponse("Label is Required", { status: 400 });
        }

        if(!imageUrl){
            return new NextResponse("Image URL is Required", { status: 400 });
        }

        if(!awaitedParams.storeId){
            return new NextResponse("Store ID is Required", { status: 400 });
        }

        const StoreByUserId = await prismadb.store.findFirst({
            where: {
                id: awaitedParams.storeId,
                userId
            }
        });
        
        if(!StoreByUserId){
            return new NextResponse("Unautherized", {status : 403});
        }

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: awaitedParams.storeId
            }
        })
        return NextResponse.json(billboard);
    }
    catch(e){
        console.log('[BILLBOARD_POST]', e);
        return new NextResponse("Internal error ", {status:500});
    }
}


export async function GET(
    req: Request,
    {params} : {params : { storeId : string}} 
) {
    try{

        const awaitedParams = await params;

        if(!awaitedParams.storeId){
            return new NextResponse("Store ID is Required", { status: 400 });
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: awaitedParams.storeId
            }
        })
        return NextResponse.json(billboards);
    }
    catch(e){
        console.log('[BILLBOARD_GET]', e);
        return new NextResponse("Internal error ", {status:500});
    }
}