import prismadb from "@/lib/prismadb";
import ColorForm from "./components/color-form";

const BillboardSetup = async ({ params }: { params: { colorId: string } }) => {
  const { colorId } = await params;

  const color = await prismadb.color.findUnique({
    where: {
      id: colorId,
    },
  });
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 pt-6 p-8">
          <ColorForm data={color} />
        </div>
      </div>
    </>
  );
};

export default BillboardSetup;
