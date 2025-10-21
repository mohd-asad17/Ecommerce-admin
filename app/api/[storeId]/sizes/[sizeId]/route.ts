import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: {
        params: {
            sizeId: string
        }
    }) {
    try {
        const awaitedParams  = await params;
        
        if (!awaitedParams.sizeId) {
            return new NextResponse("Size id is Required", { status: 400 });
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: awaitedParams.sizeId
            }
        })
        return NextResponse.json(size);
    }
    catch (error) {
        console.log("[SIZE_GET", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            storeId: string,
            sizeId: string
        }
    }) {
    try {

        const { userId } = await auth();
        const body = await req.json();
        const awaitedParams = await params;

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is Required", { status: 400 });
        }

        if (!awaitedParams.sizeId) {
            return new NextResponse("Size id is Required", { status: 400 });
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

        const size = await prismadb.size.updateMany({
            where: {
                id: awaitedParams.sizeId,
            },
            data: {
                name,
                value
            }
        })
        return NextResponse.json(size);
    }
    catch (error) {
        console.log("[SIZE_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params }: {
        params: {
            storeId: string,
            sizeId: string
        }
    }) {
    try {

        const { userId } = await auth();
        const awaitedParams  = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!awaitedParams.sizeId) {
            return new NextResponse("Size id is Required", { status: 400 });
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

        const size = await prismadb.size.deleteMany({
            where: {
                id: awaitedParams.sizeId
            }
        })
        return NextResponse.json(size);
    }
    catch (error) {
        console.log("[SIZE_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}