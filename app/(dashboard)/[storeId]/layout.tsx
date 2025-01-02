import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function DeashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  try {
    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) {
      redirect("/");
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
