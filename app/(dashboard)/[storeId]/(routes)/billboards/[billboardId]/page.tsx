import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/billboard-form";

const BillboardSetup = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 pt-6 p-8">
          <BillboardForm data={billboard} />
        </div>
      </div>
    </>
  );
};

export default BillboardSetup;
