import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    // console.log("post requested");
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();
    const { billboardId, name } = body;
    // console.log(body);
    const { storeId } = await params;
    const errors = [];
    if (!name) errors.push("Label is required.");
    if (!billboardId) errors.push("BillboardId is required.");
    if (!storeId) errors.push("Store ID is required.");
    if (errors.length > 0) {
      return new NextResponse(JSON.stringify({ errors }), { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: storeId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_POST_ERROR]", { error });
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = await params;
    const categories = await prismadb.category.findMany({
      where: {
        storeId: storeId,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("internal server error", { status: 401 });
  }
}
