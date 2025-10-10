import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: {
        params: {
            categoryId: string
        }
    }) {
    try {
        const awaitedParams  = await params;
        
        if (!awaitedParams.categoryId) {
            return new NextResponse("Category id is Required", { status: 400 });
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: awaitedParams.categoryId
            }
        })
        return NextResponse.json(category);
    }
    catch (error) {
        console.log("[CATEGORY_GET", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            storeId: string,
            categoryId: string
        }
    }) {
    try {

        const { userId } = await auth();
        const body = await req.json();
        const awaitedParams = await params;

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard Id is Required", { status: 400 });
        }

        if (!awaitedParams.categoryId) {
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

        const category = await prismadb.category.updateMany({
            where: {
                id: awaitedParams.categoryId,
            },
            data: {
                name,
                billboardId
            }
        })
        return NextResponse.json(category);
    }
    catch (error) {
        console.log("[CATEGORY_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params }: {
        params: {
            storeId: string,
            categoryId: string
        }
    }) {
    try {

        const { userId } = await auth();
        const awaitedParams  = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!awaitedParams.categoryId) {
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: awaitedParams.categoryId
            }
        })
        return NextResponse.json(category);
    }
    catch (error) {
        console.log("[CATEGORY_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}