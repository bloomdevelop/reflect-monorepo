"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, ImagePlus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import type { Channel } from "revolt.js";
import { toast } from "sonner";
import { useState, useRef, type ChangeEvent, useCallback } from "react";
import Image from "next/image";
import { CdnClass } from "@/lib/utils";
import type { Message } from "revolt.js";

const composeSchema = z.object({
    content: z.string().max(2000).optional(),
});

type FileWithPreview = {
    file: File;
    preview: string;
};

export default function ComposeComponent({
    channel,
    onMessageSent
}: {
    channel: Channel;
    onMessageSent?: (message: Message) => void;
}) {
    const cdn = new CdnClass();
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const form = useForm<z.infer<typeof composeSchema>>({
        resolver: zodResolver(composeSchema),
        defaultValues: {
            content: ""
        }
    });

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        const newFiles = Array.from(selectedFiles).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setFiles(prev => [...prev, ...newFiles]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const removeFile = useCallback((index: number) => {
        setFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    }, []);

    const onSubmit = async (values: z.infer<typeof composeSchema>) => {
        if (!values.content?.trim() && files.length === 0) return;

        try {
            let attachments: string[] = [];
            
            // Upload files if any
            if (files.length > 0) {
                const uploadPromises = files.map(async (fileWithPreview) => {
                    const formData = new FormData();
                    formData.append('file', fileWithPreview.preview);
                    
                    try {
                        const imageId = await cdn.uploadFile('attachments', fileWithPreview.file);
                        attachments.push(imageId);
                    } catch (error) {
                        if (error instanceof Error) {
                            toast.error("Failed to upload file", {description: error.message}); 
                        } else {
                            toast.error("Failed to upload file", {description: "Please try again"});
                        }
                        console.error('Upload error:', error);
                        return null;
                    }
                });

                const results = await Promise.all(uploadPromises);
                attachments = results.filter((url): url is NonNullable<typeof url> => url !== null);
            }


            // Send message with content and/or attachments
            const sentMessage = await channel.sendMessage({
                content: values.content || undefined,
                attachments
            });

            // Notify parent component about the new message
            onMessageSent?.(sentMessage);

            // Reset form
            form.reset({ content: '' });
            setFiles([]);
            
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error("Failed to send message");
        }
    };

    return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="z-20 sticky bottom-2 mx-auto w-full max-w-1/2 flex flex-col gap-2 bg-muted/50 border border-border backdrop-blur-md rounded-lg p-2 shadow-md">
                    {files.length > 0 && (
                        <div className="flex flex-row flex-wrap items-center justify-center gap-4 p-3">
                            {files.map((file, index) => (
                                <div key={file.file.name} className="relative flex flex-col gap-2">
                                    <Image
                                        src={file.preview}
                                        alt="Preview"
                                        height={100}
                                        width={100}
                                        className="object-cover rounded-lg shadow"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute size-8 -top-2 -right-2 shadow-md"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-row items-center gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                            disabled={!channel.havePermission("UploadFiles")}
                        />
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            disabled={!channel.havePermission("UploadFiles")}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImagePlus className="w-5 h-5" />
                        </Button>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input 
                                            disabled={!channel.havePermission("SendMessage")} 
                                            placeholder={files.length > 0 ? "Add a caption..." : "Send a message..."} 
                                            {...field} 
                                        />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <Button 
                            type="submit" 
                            size="icon" 
                            disabled={!channel.havePermission("SendMessage") || (!form.watch('content')?.trim() && files.length === 0)}
                        >
                            <ArrowUp className="w-5 h-5" />
                        </Button>
                    </div>
                </form>    
            </Form>            
    )
}