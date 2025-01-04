import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import SizeClient from "./components/client";

const Sizes = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = await params;
  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedSizes = sizes.map((size) => {
    return {
      id: size.id,
      name: size.name,
      value: size.value,
      createdAt: format(size.createdAt, "MMMM do,yyyy"),
    };
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default Sizes;
