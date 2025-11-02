import { useState, type ChangeEventHandler } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { handleCatchBlockError } from "@/utility";
import { updateUserProfile } from "@/api/user";
import useUserStore from "@/stores/user.store";
import { useShallow } from "zustand/react/shallow";
import type { UserRegisterFormValueType } from "@/types";

function ProfileChildPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { stUser, stFnUpdateUser } = useUserStore(useShallow((state) => ({ stUser: state.stUser, stFnUpdateUser: state.stFnUpdateUser })));

  const [userDetails, setUserDetails] = useState<Partial<UserRegisterFormValueType>>({
    firstName: stUser.firstName??"",
    lastName:stUser.lastName??""
  })

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUserDetails((prev)=>({...prev,[e.target.name]: e.target.value}));
  };

  const handleSave = async() => {
    setIsEditing(false);
    try {
      const res = await updateUserProfile(userDetails);
      if (res?.success) {
        toast.success("Profile updated successfully!");
        console.log(res, "res");
        stFnUpdateUser({ ...res.data });
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      console.log("Error in handleSave: ", err);
      handleCatchBlockError(err, "Error updating stUser.")
    }
  };


  return (
    <div className="h-full bg-[#f8fafc] flex justify-center items-center">
      <Card className="w-full max-w-lg shadow-lg border border-gray-200 pt-0">
        <CardHeader className="bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 mt-5">
          <div>
            <Label className="text-gray-700">User ID</Label>
            <Input
              value={stUser.userId??""}
              disabled
              className="mt-1 bg-gray-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700">First Name</Label>
              <Input
                name="firstName"
                value={userDetails.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-100 mt-1" : "mt-1"}
              />
            </div>
            <div>
              <Label className="text-gray-700">Last Name</Label>
              <Input
                name="lastName"
                value={userDetails.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-100 mt-1" : "mt-1"}
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-700">Groq Api Key</Label>
            <Input
              type="password"
              value={new Date(stUser.createdAt).toLocaleString()}
              disabled
              className="mt-1 bg-gray-100"
            />
          </div>
          <div>
            <Label className="text-gray-700">Created At</Label>
            <Input
              value={new Date(stUser.createdAt).toLocaleString()}
              disabled
              className="mt-1 bg-gray-100"
            />
          </div>
          <div>
            <Label className="text-gray-700">Updated At</Label>
            <Input
              value={new Date(stUser.updatedAt).toLocaleString()}
              disabled
              className="mt-1 bg-gray-100"
            />
          </div>

          <div className="flex justify-end pt-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-indigo-600 hover:bg-indigo-700">
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-gray-400 text-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default function ProfilePage(){
  return (
    <div className="flex w-full justify-between h-full bg-(--theme-bg-container) font-sans text-gray-900">
      <Sidebar />
      <main className="flex w-[calc(100%-272px)] flex-col bg-white">
        <Header />
        <ProfileChildPage />
      </main>
    </div>
  );
};