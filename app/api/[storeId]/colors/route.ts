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

        const { name, value } = body;

        if(!name){
            return new NextResponse("Name is Required", { status: 400 });
        }

        if(!value){
            return new NextResponse("Value is Required", { status: 400 });
        }

        if(!awaitedParams.storeId){
            return new NextResponse("Store Id is Required", { status: 400 });
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

        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: awaitedParams.storeId
            }
        })
        return NextResponse.json(color);
    }
    catch(e){
        console.log('[COLOR_POST]', e);
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

        const colors = await prismadb.color.findMany({
            where: {
                storeId: awaitedParams.storeId
            }
        })
        return NextResponse.json(colors);
    }
    catch(e){
        console.log('[COLORS_GET]', e);
        return new NextResponse("Internal error ", {status:500});
    }
}