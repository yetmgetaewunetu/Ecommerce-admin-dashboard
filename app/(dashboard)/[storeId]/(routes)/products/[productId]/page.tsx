import prismadb from "@/lib/prismadb";
import ProductForm  from "./components/product-form";

const BillboardSetup = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const { productId } = await params;

  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include:{
      images: true
    }
  });
  return (
    
      <div className="flex-col">
        <div className="flex-1 space-y-4 pt-6 p-8">
          <ProductForm data={product} />
        </div>
      </div>
    
  );
};

export default BillboardSetup;
