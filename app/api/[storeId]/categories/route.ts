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

        const { name, billboardId } = body;

        if(!name){
            return new NextResponse("Name is Required", { status: 400 });
        }

        if(!billboardId){
            return new NextResponse("Billboard id is Required", { status: 400 });
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

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: awaitedParams.storeId
            }
        })
        return NextResponse.json(category);
    }
    catch(e){
        console.log('[CATEGORY_POST]', e);
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

        const categories = await prismadb.category.findMany({
            where: {
                storeId: awaitedParams.storeId
            }
        })
        return NextResponse.json(categories);
    }
    catch(e){
        console.log('[CATEGORIES_GET]', e);
        return new NextResponse("Internal error ", {status:500});
    }
}