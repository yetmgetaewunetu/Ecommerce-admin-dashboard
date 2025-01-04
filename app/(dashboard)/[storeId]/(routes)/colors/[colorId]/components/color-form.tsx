"use client";

import * as z from "zod";
import { useState } from "react";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
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

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().regex(/^#/, {
    message: "string must be a valid hex code",
  }),
});

interface ColorFormProps {
  data: Size | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

const ColorForm: React.FC<ColorFormProps> = ({ data }) => {
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      name: "",
      value: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { storeId, colorId } = params;
  const title = data ? "Edit color." : "Create color";
  const description = data ? "Edit color." : "Add a new color";
  const toastMessage = data ? "Color updated." : "Color created";
  const action = data ? "save changes" : "Create";

  const onSubmit = async (values: ColorFormValues) => {
    try {
      setLoading(true);
      if (data) {
        console.log("patch from ui");
        await axios.patch(`/api/${storeId}/colors/${colorId}`, values);
      } else {
        await axios.post(`/api/${storeId}/colors`, values);
      }
      router.push(`/${storeId}/colors`);
      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${storeId}/colors/${colorId}`);
      router.refresh();
      router.push("/");
      toast.success("Color deleted");
      router.push(`/${storeId}/colors`);
    } catch (error) {
      console.log(error);
      toast.error(
        "Make sure you removed all categories that are using this color first"
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
        onConfirm={onDelete}
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
                        placeholder="Size name"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <div className="flex justify-center space-x-4">
                        <Input
                          placeholder="Size value"
                          disabled={loading}
                          {...field}
                        />
                        <div
                          className="p-4 rounded-full border"
                          style={{ background: field.value }}
                        />
                      </div>
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
    </>
  );
};

export default ColorForm;
