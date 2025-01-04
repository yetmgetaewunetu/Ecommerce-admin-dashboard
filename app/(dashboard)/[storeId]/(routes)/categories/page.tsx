import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import CategoryClient from "./components/client";
import { CategoryColumns } from "./components/columns";

const Categories = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = await params;
  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedCategories: CategoryColumns[] = categories.map((category) => {
    return {
      id: category.id,
      name: category.name,
      billboardLabel: category.billboard.label,
      createdAt: format(category.createdAt, "MMMM do,yyyy"),
    };
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default Categories;
