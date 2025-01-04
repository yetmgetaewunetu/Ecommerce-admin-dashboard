import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/billboard-form";

const BillboardSetup = async ({ params }: { params: { sizeId: string } }) => {
  const { sizeId } = await params;

  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId,
    },
  });
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 pt-6 p-8">
          <BillboardForm data={size} />
        </div>
      </div>
    </>
  );
};

export default BillboardSetup;
