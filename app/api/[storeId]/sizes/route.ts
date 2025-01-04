import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    console.log("post requested");
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();
    const { name, value } = body;
    const { storeId } = await params;
    const errors = [];
    if (!name) errors.push("Label is required.");
    if (!value) errors.push("Image URL is required.");
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

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: storeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZE_POST_ERROR]", { error });
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = await params;
    const size = await prismadb.size.findMany({
      where: {
        storeId: storeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("internal server error", { status: 401 });
  }
}
