"use client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns, ProductColumns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface ProductClientProps {
  data: ProductColumns[]; 
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const { storeId } = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="Api" description="Api Calls for products" />
      <Separator />

      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};

export default ProductClient;
