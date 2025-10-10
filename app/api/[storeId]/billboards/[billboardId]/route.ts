import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: {
        params: {
            billboardId: string
        }
    }) {
    try {
        const awaitedParams  = await params;
        
        if (!awaitedParams.billboardId) {
            return new NextResponse("Billboard id is Required", { status: 400 });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: awaitedParams.billboardId
            }
        })
        return NextResponse.json(billboard);
    }
    catch (error) {
        console.log("[BILLBOARD_GET", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            storeId: string,
            billboardId: string
        }
    }) {
    try {

        const { userId } = await auth();
        const body = await req.json();
        const awaitedParams = await params;

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Label is Required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Image URL is Required", { status: 400 });
        }

        if (!awaitedParams.billboardId) {
            return new NextResponse("Billboard id is Required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where : {
                id: awaitedParams.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unautherized", {status: 403});
        }

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: awaitedParams.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })
        return NextResponse.json(billboard);
    }
    catch (error) {
        console.log("[BILLBOARD_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params }: {
        params: {
            storeId: string,
            billboardId: string
        }
    }) {
    try {

        const { userId } = await auth();
        const awaitedParams  = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!awaitedParams.billboardId) {
            return new NextResponse("Category id is Required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where : {
                id: awaitedParams.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unautherized", {status: 403});
        }

        const billboard = await prismadb.category.deleteMany({
            where: {
                id: awaitedParams.billboardId,
                storeId: awaitedParams.storeId
            }
        })
        return NextResponse.json(billboard);
    }
    catch (error) {
        console.log("[BILLBOARD_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}