"use client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import ApiList from "@/components/ui/api-list";

interface ColorClientProps {
  data: {
    id: string;
    name: string;
    value: string;
    createdAt: string;
  }[];
}

const ColorClient: React.FC<ColorClientProps> = ({ data }) => {
  const { storeId } = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage Colors for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="Api" description="Api Calls for colors" />
      <Separator />

      <ApiList entityName="color" entityIdName="colorId" />
    </>
  );
};

export default ColorClient;
