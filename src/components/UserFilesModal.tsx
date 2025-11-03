import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";
import { ASK_MY_DATA_API_BASE_URL } from "@/constants/api.constant";
import React from "react";
import { BADGE_COLOR_STATUS_MAPPING } from "@/constants";
import type { FileStatus, FileType, UserType } from "@/types";



interface UserFilesModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  files?: FileType[] | null;
  onDelete: (fileId: string) => Promise<void>;
  clickedUser:UserType|null
}

const StatusBadge: React.FC<{ status: FileStatus }> = ({ status }) => {


  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${BADGE_COLOR_STATUS_MAPPING[status]}`}>
      {status}
    </span>
  );
};

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

function formatDate(value: string | number | Date): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

export default function UserFilesModal({ open, onClose, files, onDelete, clickedUser }: UserFilesModalProps) {
  const safeFiles = Array.isArray(files) ? files : [];

  const openFile = (path: string) => {
    const joined = `${ASK_MY_DATA_API_BASE_URL}`.replace(/\/$/, "") + "/" + `${path}`.replace(/^\//, "");
    window.open(joined, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[70vw]! max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Files Uploaded by {clickedUser?.firstName + " " + clickedUser?.lastName}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[calc(80vh-84px)] overflow-auto relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0 bg-white">
                <TableHead>ID</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {safeFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    No files uploaded yet.
                  </TableCell>
                </TableRow>
              ) : (
                safeFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="truncate w-48">{file.id}</TableCell>
                    <TableCell>{file.originalName}</TableCell>
                    <TableCell>{formatBytes(file.size)}</TableCell>
                    <TableCell>{formatDate(file.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={file.status || "UNKNOWN"} />
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openFile(file.filePath)}
                      >
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(file.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
