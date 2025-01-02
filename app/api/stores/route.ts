import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name } = body;
    console.log(body);
    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    return new NextResponse(JSON.stringify(store));
  } catch (error) {
    console.log("[STORE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
