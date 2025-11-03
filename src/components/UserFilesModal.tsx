import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";
import { ASK_MY_DATA_API_BASE_URL } from "@/constants/api.constant";

export default function UserFilesModal({ open, onClose, files }) {

  const statusBadge=(status )=> {
    const color =
      status === "PENDING"
        ? "bg-yellow-100 text-yellow-800"
        : status === "EMBEDDED"
          ? "bg-green-100 text-green-800"
          : status === "FAILED"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800";

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
        {status}
      </span>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[70vw]! max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>User Uploaded Files</DialogTitle>
        </DialogHeader>
        <div className="max-h-[calc(80vh-84px)] overflow-auto relative overflow-x-auto">
        <Table >
          <TableHeader>
            <TableRow className="sticky top-0 bg-white">
              <TableHead>ID</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded On</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="truncate w-48">{file.id}</TableCell>
                <TableCell>{file.originalName}</TableCell>
                <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{statusBadge(file.status)}</TableCell>
                <TableCell className="space-x-2">
                  {/* VIEW */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${ASK_MY_DATA_API_BASE_URL}${file.filePath}`, "_blank")}
                  >
                    View
                  </Button>

                  {/* DELETE */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
