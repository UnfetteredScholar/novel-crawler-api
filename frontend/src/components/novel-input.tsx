import { cn } from "@/lib/utils";
import { LoaderCircle, Search, X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NovelInfo } from "@/types/response-types";
import { toast } from "sonner";
import { useAddNovelDialog } from "@/store/use-add-novel-dialog";

const urlSchema = z.object({
  url: z.string().url("Invalid URL"),
});

type UrlSchema = z.infer<typeof urlSchema>;

export function NovelInput() {
  const [, setOpen] = useAddNovelDialog();

  const form = useForm<UrlSchema>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async ({ url }: UrlSchema) => {
    console.log("s");

    try {
      const res = await fetch(`/api/v1/novel/info?url=${url}`);
      if (!res.ok) {
        const error = (await res.json()) as { detail: string };
        throw new Error(error.detail);
      }

      const data = (await res.json()) as NovelInfo;
      setOpen(data);
    } catch (error) {
      if (!(error instanceof Error)) return;
      toast.error(error.message);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (form.formState.isSubmitting) e.preventDefault();
          }}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter URL"
                      className={cn(
                        "flex h-10 w-full rounded-md",
                        "border border-input bg-background px-3 py-2 pr-16 text-base ring-offset-background placeholder:text-muted-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                      )}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center space-x-2 px-1">
                      {form.getValues("url") && (
                        <button
                          type="button"
                          onClick={() => {
                            form.setValue("url", "");
                            form.setFocus("url");
                          }}
                          className="p-1 text-muted-foreground hover:text-foreground"
                          aria-label="Clear input"
                        >
                          <X size={16} />
                        </button>
                      )}
                      {form.formState.isSubmitting ? (
                        <div
                          className="p-1 text-muted-foreground hover:text-foreground"
                          aria-label="loader"
                        >
                          <LoaderCircle className="animate-spin" size={16} />
                        </div>
                      ) : (
                        <button
                          type="submit"
                          className="p-1 text-muted-foreground hover:text-foreground"
                          aria-label="Submit search"
                        >
                          <Search size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}
