import { UserButton } from "@clerk/nextjs";

import MainNav from "@/components/main-nav";
import StoreSwicher from "@/components/store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

async function Navbar() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <div className=" border-b ">
      <div className="flex h-16 px-4 items-center ">
        <StoreSwicher items={stores} />
        <MainNav className="mx-6" />
        <div className=" ml-auto space-x-4 items-center">
          <UserButton />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
