"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Paperclip, Plus, X } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CdnClass } from "@/lib/utils";
import type { Channel, Message } from "revolt.js";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";

const composeSchema = z.object({
  content: z.string().optional(),
});

type FileWithPreview = {
  file: File;
  preview: string;
};

type AttachmentsPreviewProps = {
  files: FileWithPreview[];
  onRemove: (index: number) => void;
  onAdd: (files: FileList) => void;
};

import React from "react";

const AttachmentsPreview = React.memo(
  ({ files, onRemove, onAdd }: AttachmentsPreviewProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        onAdd(droppedFiles);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onAdd(e.target.files);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 500 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 500 }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 25,
          mass: 1,
        }}
        className="w-full backdrop-blur-md"
      >
        <div
          className={`w-full p-4 border-t border-border transition-colors max-h-56 overflow-auto ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border bg-muted/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-row flex-wrap items-start gap-4">
            {files.map((file, index) => (
              <AnimatePresence key={file.file.name}>
                <motion.div
                  className="relative flex flex-col gap-2 group/item"
                  initial={{ opacity: 0, scale: 2, rotateZ: 10 }}
                  animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 14,
                    mass: 1,
                  }}
                >
                  <div className="relative">
                    <div className="relative w-24 h-24 overflow-hidden rounded-lg bg-transparent">
                      <Image
                        src={file.preview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 opacity-0 transition-opacity duration-200 ease-in-out group-hover/item:opacity-100 backdrop-blur-md h-5 w-5 rounded-full shadow-md"
                      onClick={() => {
                        onRemove(index);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}

            <div className="relative">
              <motion.label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center w-24 h-24 border-2 rounded-lg cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border hover:border-primary/50 hover:bg-accent/20"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <Plus
                  className={`h-6 w-6 mb-1.5 transition-colors ${
                    isDragging ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-xs text-center px-1.5 transition-colors ${
                    isDragging
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  Add Image/Video
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                />
              </motion.label>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">
              Tip: You can drag and drop files here
            </p>
          </div>
        </div>
      </motion.div>
    );
  },
);

export default function ComposeComponent({
  channel,
  onMessageSent,
}: {
  channel: Channel;
  onMessageSent?: (message: Message) => void;
}) {
  const cdn = new CdnClass();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [showAttachments, setShowAttachments] = useState<boolean>(false);

  const form = useForm<z.infer<typeof composeSchema>>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleAddFiles = useCallback((fileList: FileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (index >= 0 && index < newFiles.length) {
        URL.revokeObjectURL(newFiles[index].preview);
        newFiles.splice(index, 1);
      }
      return newFiles;
    });
  }, []);

  const onSubmit = async (values: z.infer<typeof composeSchema>) => {
    if (!values.content?.trim() && files.length === 0) return;

    try {
      const attachments: string[] = [];

      // Upload files if any
      if (files.length > 0) {
        // Use Promise.all to wait for all uploads to complete
        const uploadPromises = files.map(async (fileWithPreview) => {
          try {
            const imageId = await cdn.uploadFile(
              "attachments",
              fileWithPreview.file,
            );
            toast.info("File uploaded successfully", { description: imageId });
            return imageId;
          } catch (error) {
            if (error instanceof Error) {
              toast.error("Failed to upload file", {
                description: error.message,
              });
            } else {
              toast.error("Failed to upload file", {
                description: "Please try again",
              });
            }
            console.error("Upload error:", error);
            return null;
          }
        });

        // Wait for all uploads to complete and filter out any failed uploads
        const uploadedIds = (await Promise.all(uploadPromises)).filter(
          Boolean,
        ) as string[];
        attachments.push(...uploadedIds);
      }

      // Send message with content and/or attachments
      const sentMessage = await channel.sendMessage({
        content: values.content || undefined,
        attachments: attachments,
      });

      // Notify parent component about the new message
      onMessageSent?.(sentMessage);

      // Reset form
      form.reset({ content: "" });
      setFiles([]);
      setShowAttachments(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="sticky bottom-0 flex flex-col">
      <Form {...form}>
        <AnimatePresence>
          {showAttachments && (
            <AttachmentsPreview
              files={files}
              onRemove={removeFile}
              onAdd={handleAddFiles}
            />
          )}
        </AnimatePresence>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-2 bg-muted/50 border-t border-border backdrop-blur-md p-2 shadow-md"
        >
          <div className="flex flex-row items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!channel.havePermission("UploadFiles")}
              onClick={() => setShowAttachments(!showAttachments)}
            >
              <Paperclip className="size-5" />
            </Button>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      disabled={!channel.havePermission("SendMessage")}
                      placeholder={
                        files.length > 0
                          ? "Add a caption..."
                          : "Send a message..."
                      }
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={
                !channel.havePermission("SendMessage") ||
                (!form.watch("content")?.trim() && files.length === 0)
              }
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
        </motion.form>
      </Form>
    </div>
  );
}
