import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash, Edit, Ban, UserCheckIcon, ShieldOff, Shield, UserPlus } from "lucide-react";
import type { UserType } from "@/types";
import { getAllUsers, enableDisableUser as enableDisableSelectedUser, deleteUser as deleteSelectedUser, makeRemoveAdmin as makeRemoveAdminSelectedUser } from "@/api/user";
import { toast } from "react-toastify";
import { handleCatchBlockError } from "@/utility";
import {useNavigate } from "react-router-dom";
import UserFilesModal from "@/components/UserFilesModal";
import { deleteUserFiles, getUserFiles, } from "@/api/file";
import useUserStore from "@/stores/user.store";
import { useShallow } from "zustand/react/shallow";
import CreateUserModal from "@/components/CreateUserModal";

const AdminSettingsPage = () => {
  const stUser = useUserStore(useShallow((state) => state.stUser));
  const [users, setUsers] = useState<UserType[]>([]);
  const [clickedUser, setClickedUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleUserClick = (userId: number, editClicked = false) => {
    const profileUrl = `/app/profile/${userId}?editMode=${editClicked}`;
    navigate(profileUrl);
  }
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
  const handleOpenFiles = useCallback(async (user: UserType) => {
    try {
      if (!user.userId) return;
      const res = await getUserFiles(user.userId ?? clickedUser?.userId);
      if (res?.success) {
        setFiles(res.data);
        if (!clickedUser) {
          setClickedUser(user);
        }
        if (!open) {
          setOpen(true);
        }
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Failed to load files:", error);
      handleCatchBlockError(error);
    }
  }, [clickedUser, open]);

  const onFileDelete = useCallback(async (fileId: string) => {
    try {
      if (!clickedUser?.userId) return;
      const res = await deleteUserFiles(clickedUser?.userId, fileId);
      await handleOpenFiles(clickedUser);
      if (res?.success) {
        toast.success("File deleted successfully.");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log("Failed to delete files:", error);
      handleCatchBlockError(error, "Failed to delete files");
    }

  }, [clickedUser, handleOpenFiles]);
  // ✅ Disable User
  const enableDisableUser = async (user:UserType) => {
    try {
      if (!user.userId) return;
      const res = await enableDisableSelectedUser(user.userId);
      if (res?.success) {
        toast.success(`User ${user.isActive ? "Disabled" :"Enabled"} successfully.`);
        getUsers();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Failed to disable user:", error);
      handleCatchBlockError(error, "Failed to disable user");
    }
  };

  const makeRemoveAdmin = async (user: UserType) => {
    try {
      if (!user.userId) return;
      const res = await makeRemoveAdminSelectedUser(user.userId);
      if (res?.success) {
        toast.success(`User has been ${user.isAdmin ? "removed" : "made"} as an admin.`);
        getUsers();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Failed to disable user:", error);
      handleCatchBlockError(error, "Failed to disable user");
    }
  };

  // ✅ Delete User
  const deleteUser = async (userId: number) => {
    try {
      const res = await deleteSelectedUser(userId ?? 0);
      if (res?.success) {
        toast.success("User deleted successfully.");
        getUsers();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Failed to disable user:", error);
      handleCatchBlockError(error, "Failed to disable user");
    }
  };


  useEffect(() => {
    if (!open && !openCreateUserModal) {
      getUsers();
    }
  }, [open, openCreateUserModal]);

  if (!stUser.isAdmin) {
    return navigate("/app")
  }

  return (
    <div className="p-6 h-full">
      <Card className="shadow-md h-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex justify-between">
            User Management
            <Button
              size="sm"
              className="bg-indigo-500 text-white hover:bg-indigo-600"
              onClick={()=>setOpenCreateUserModal(true)}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Create User
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="h-full overflow-y-auto">
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
                  <TableHead>Admin</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-[calc(100%-566px)] overflow-y-auto">
                {users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="cursor-pointer" onClick={() => handleUserClick(user.userId ?? 0)}>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="cursor-pointer" onClick={() => handleOpenFiles(user)}>{user?.filesCount || 0}</TableCell>
                    <TableCell>
                      {user?.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Disabled</Badge>

                      )}
                    </TableCell>
                    <TableCell>
                      {user?.isAdmin ? (
                        <Badge className="bg-green-500">Admin</Badge>
                      ) : (
                        <Badge variant="destructive">User</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleUserClick(user.userId ?? 0, true)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => enableDisableUser(user)}
                        disabled={user.userId === stUser.userId}
                      >
                        {
                          user?.isActive ? <Ban className="h-4 w-4 mr-1 text-red-500" />
                            : <UserCheckIcon className="h-4 w-4 mr-1 text-green-500" />
                        }
                        {
                          user?.isActive ? "Disable" : "Enable"
                        }
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteUser(user.userId ?? 0)}
                        disabled={user.userId === stUser.userId}
                      >
                        <Trash className="h-4 w-4 mr-1" /> Delete
                      </Button>

                      {
                        user.userId !== stUser.userId && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className={
                              user?.isAdmin
                                ? "bg-red-500 text-white"   // removing admin
                                : "bg-indigo-500 text-white" // making admin
                            }
                            onClick={() => makeRemoveAdmin(user)}
                            disabled={user.userId === stUser.userId}
                          >
                            {user?.isAdmin
                              ? <ShieldOff className="h-4 w-4 mr-1" />
                              : <Shield className="h-4 w-4 mr-1" />}
                            {user?.isAdmin ? "Remove as Admin" : "Make as Admin"}
                          </Button>
                        )
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <UserFilesModal clickedUser={clickedUser} open={open} onClose={() => setOpen(false)} files={files} onDelete={onFileDelete} />
      <CreateUserModal open={openCreateUserModal} setOpen={setOpenCreateUserModal}/>
    </div>
  );
};


export default AdminSettingsPage;
