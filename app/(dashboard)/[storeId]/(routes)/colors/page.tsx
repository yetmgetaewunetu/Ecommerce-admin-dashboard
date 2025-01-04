import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import ColorClient from "./components/client";

const Colors = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = await params;
  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedColors = colors.map((size) => {
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
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default Colors;
