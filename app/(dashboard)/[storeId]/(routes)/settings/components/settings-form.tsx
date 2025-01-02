"use client";

import * as z from "zod";
import { useState } from "react";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { store } from "@prisma/client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import useOrigin from "@/hooks/use-origin";

interface SettingsFormProps {
  data: store;
}

const formSchema = z.object({
  name: z.string().min(1),
});
type SettingFormValues = z.infer<typeof formSchema>;
const SettingsForm: React.FC<SettingsFormProps> = ({ data }) => {
  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const onSubmit = async (data: SettingFormValues) => {
    try {
      setLoading(true);
      console.log("store Id: ", params.storeId);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Store Updated");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const deleteStore = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store deleted");
    } catch (error) {
      console.log(error);
      toast.error("Make sure you removed all products and categories first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={deleteStore}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage your store" />
        <Button
          disabled={loading}
          variant="destructive"
          onClick={() => setOpen(true)}
          size="icon"
        >
          <Trash size="icon" className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Store name"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <Button type="submit" disabled={loading}>
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
