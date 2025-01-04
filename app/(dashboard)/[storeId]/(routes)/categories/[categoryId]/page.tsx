import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/category-form";

const BillboardSetup = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const { categoryId, storeId } = await params;

  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  const billboard = await prismadb.billboard.findMany({
    where: {
      storeId: storeId,
    },
  });
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 pt-6 p-8">
          <CategoryForm billboards={billboard} data={category} />
        </div>
      </div>
    </>
  );
};

export default BillboardSetup;
