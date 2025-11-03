import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash, Edit, Ban } from "lucide-react";
import type { UserType } from "@/types";
import { getAllUsers } from "@/api/user";
import { toast } from "react-toastify";
import { handleCatchBlockError } from "@/utility";
import { useNavigate } from "react-router-dom";
import UserFilesModal from "@/components/UserFilesModal";
import { getUserFiles } from "@/api/file";

const AdminSettingsPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  // ✅ Fetch all users from backend
  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      if (res?.success) {
        setUsers(res?.data);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      handleCatchBlockError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenFiles = async (userId: number | null) => {
    try {
      const res = await getUserFiles(userId);
      if (res?.success) {
        setFiles(res.data);
        setOpen(true);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Failed to load files:", error);
      handleCatchBlockError(error);
    } 
  };

  // ✅ Disable User
  const disableUser = async (id: number) => {
    await fetch(`/api/admin/users/${id}/disable`, { method: "POST" });
    getUsers();
  };

  // ✅ Delete User
  const deleteUser = async (id: number) => {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    getUsers();
  };


  useEffect(() => {
    getUsers();
  }, []);



  return (
    <div className="p-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            User Management
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="cursor-pointer" onClick={() => navigate(`/app/profile/${user.userId}`)}>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="cursor-pointer" onClick={()=>handleOpenFiles(user.userId)}>{user?.filesCount || 0}</TableCell>
                    <TableCell>
                      {user?.isDisabled ? (
                        <Badge variant="destructive">Disabled</Badge>
                      ) : (
                        <Badge className="bg-green-500">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>

                      {!user?.isDisabled && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => disableUser(user.userId??0)}
                        >
                          <Ban className="h-4 w-4 mr-1 text-red-500" /> Disable
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteUser(user.userId??0)}
                      >
                        <Trash className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
          )}
        </CardContent>
      </Card>
        <UserFilesModal open={open} onClose={() => setOpen(false)} files={files} />
    </div>
  );
};


export default AdminSettingsPage;
