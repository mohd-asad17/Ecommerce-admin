"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Store } from "@/lib/generated/prisma"
import { Trash } from "lucide-react";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

interface SettingFromProps {
    initialData: Store
}

const formSchema = z.object({
    name: z.string().min(1)
})

type SettingFormValue = z.infer<typeof formSchema>;

export const SettingForm: React.FC<SettingFromProps> = ({ initialData }) => {
    const [open , setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const onSubmit = async (data: SettingFormValue) => {
        console.log(data);
    }
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Setting Title"
                    description="Manage the store" />
                <Button 
                disabled={loading}
                variant="destructive"
                    size="icon"
                    onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({field}) =>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} type="submit" className="ml-auto">
                        Save Changes
                    </Button>
                </form>
            </Form>
        </>
    )
}