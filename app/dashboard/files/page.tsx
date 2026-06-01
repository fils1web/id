"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { PageTransition } from "@/components/ui/PageTransition";
import { Upload, Trash2, Download, FileIcon } from "lucide-react";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import type { ProjectFile } from "@/types";

export default function DashboardFilesPage() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await supabase.from("files").select("*").order("created_at", { ascending: false });
      if (data) setFiles(data as ProjectFile[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    await supabase.from("files").delete().eq("id", id);
    load();
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
            Files Manager
          </h1>
          <GoldButton onClick={() => setShowUploader(!showUploader)} className="!px-4 !py-2 !text-sm">
            <Upload className="w-4 h-4 mr-1 inline" /> Upload File
          </GoldButton>
        </div>

        {showUploader && (
          <GlassCard className="p-6">
            <FileUploader onSuccess={() => { setShowUploader(false); load(); }} />
          </GlassCard>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <FileIcon className="w-12 h-12 mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400 font-body">No files uploaded yet.</p>
          </GlassCard>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10">
                  <th className="text-left py-3 px-2 text-gray-400 font-body font-normal">Name</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-body font-normal hidden md:table-cell">Type</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-body font-normal hidden md:table-cell">Size</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-body font-normal hidden lg:table-cell">Downloads</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-body font-normal hidden lg:table-cell">Date</th>
                  <th className="text-right py-3 px-2 text-gray-400 font-body font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} className="border-b border-gold/5 hover:bg-white/5">
                    <td className="py-3 px-2">
                      <p className="text-white font-body font-medium">{file.name}</p>
                      {file.description && <p className="text-gray-500 text-xs">{file.description}</p>}
                    </td>
                    <td className="py-3 px-2 text-gray-400 hidden md:table-cell">{file.file_type || "other"}</td>
                    <td className="py-3 px-2 text-gray-400 hidden md:table-cell">
                      {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : "—"}
                    </td>
                    <td className="py-3 px-2 text-gray-400 hidden lg:table-cell">{file.download_count || 0}</td>
                    <td className="py-3 px-2 text-gray-500 text-xs hidden lg:table-cell">{format(new Date(file.created_at), "MMM d, yyyy")}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-cyan hover:bg-cyan/10 rounded-lg transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </a>
                        <button onClick={() => handleDelete(file.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
