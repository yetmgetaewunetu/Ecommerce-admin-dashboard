"use client";

import * as z from "zod";
import { useState } from "react";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
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

import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

interface BillboardFormProps {
  data: Billboard | null;
}

type SettingFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ data }) => {
  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      label: "",
      imageUrl: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = data ? "Edit billboard." : "Create billboard";
  const description = data ? "Edit billboard." : "Add a new billboard";
  const toastMessage = data ? "Billboard updated." : "Billboard created";
  const action = data ? "save changes" : "Create";

  const onSubmit = async (data: SettingFormValues) => {
    try {
      setLoading(true);
      if (data) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        const billboard = await axios.post(
          `/api/${params.storeId}/billboards`,
          data
        );
        console.log(billboard);
      }
      // const response = await axios.get(`/api/${params.storeId}/billboards`);
      // console.log(response);
      toast.success(toastMessage);
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
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push("/");
      toast.success("Billboard deleted");
    } catch (error) {
      console.log(error);
      toast.error(
        "Make sure you removed all categories that are using this billboard first"
      );
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
        <Heading title={title} description={description} />
        {data && (
          <Button
            disabled={loading}
            variant="destructive"
            onClick={() => setOpen(true)}
            size="icon"
          >
            <Trash size="icon" className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      onRemove={() => {
                        field.onChange("");
                      }}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Billboard label"
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
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default BillboardForm;
