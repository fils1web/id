"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import { GoldButton } from "@/components/ui/GoldButton";
import { Upload, FileIcon } from "lucide-react";

interface FileUploaderProps {
  onSuccess: () => void;
}

export function FileUploader({ onSuccess }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setName(accepted[0].name);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name.trim()) { setError("File and name are required"); return; }
    setUploading(true);
    setError("");

    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(`files/${fileName}`, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(`files/${fileName}`);

      const fileType = file.type.split("/")[0] === "image" ? "image" :
        file.type === "application/pdf" ? "pdf" :
        file.type.startsWith("video") ? "video" :
        file.name.endsWith(".zip") ? "zip" : "other";

      const { error: dbError } = await supabase.from("files").insert({
        name,
        description: description || null,
        file_url: urlData.publicUrl,
        file_type: fileType,
        file_size: file.size,
      });
      if (dbError) throw dbError;

      setFile(null);
      setName("");
      setDescription("");
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4 max-w-lg">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      <div {...getRootProps()} className="border-2 border-dashed border-gold/20 rounded-xl p-8 text-center cursor-pointer hover:border-gold/50 transition-colors">
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-sm text-gray-400 font-body">Drop a file here or click to browse</p>
        {file && <p className="text-gold text-sm mt-2">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
      </div>

      <div>
        <label className="block text-sm font-body text-gray-300 mb-1">File Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body focus:outline-none focus:border-gold/50"
          placeholder="My File"
        />
      </div>

      <div>
        <label className="block text-sm font-body text-gray-300 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-4 py-2 bg-white/5 border border-gold/20 rounded-xl text-white font-body focus:outline-none focus:border-gold/50 resize-none"
          placeholder="Optional description"
        />
      </div>

      <GoldButton type="submit" loading={uploading}>
        Upload File
      </GoldButton>
    </form>
  );
}
