import { useEffect, useState, type ChangeEventHandler } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { toast } from "react-toastify";
import { decryptMethod, encryptMethod, handleCatchBlockError } from "@/utility";
import { getUserDetailsByUserId, updateUserProfile } from "@/api/user";
import useUserStore from "@/stores/user.store";
import { useShallow } from "zustand/react/shallow";
import type { UserType } from "@/types";
import { useParams, useSearchParams } from "react-router-dom";
import { Eye } from "lucide-react";
import Loader from "@/components/Loader";

function ProfilePage() {
  const { stUser, stFnUpdateUser } = useUserStore(useShallow((state) => ({ stUser: state.stUser, stFnUpdateUser: state.stFnUpdateUser })));
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(searchParams.get("editMode") === "true");

  const [userDetails, setUserDetails] = useState<Partial<UserType>>({
    userId: 0,
    email: "",
    groqApiKey: "",
    firstName: "",
    lastName: "",
    createdAt: "",
    updatedAt: ""
  })
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.name === "groqApiKey" ? encryptMethod(e.target.value??"") : e.target.value }));
  };

  const clearEditMode = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("editMode");
    setSearchParams(next);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const payload = {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        groqApiKey: userDetails.groqApiKey
      }
      setLoading(true)
      const res = await updateUserProfile(payload);
      if (res?.success) {
        toast.success("Profile updated successfully!");
        if (Number(params.id) === stUser.userId) {
          stFnUpdateUser(res.data);
        }
        setUserDetails(res.data);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      console.log("Error in handleSave: ", err);
      handleCatchBlockError(err, "Error updating stUser.")
    } finally {
      setLoading(false);
    }
  };

  const getUserDetailsId = async (id: number) => {
    try {
      setLoading(true)
      const res = await getUserDetailsByUserId(id);
      if (res?.success) {
        setUserDetails(res.data);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      console.log("Error in getUserDetailsByUserId: ", err);
      handleCatchBlockError(err, "Error fetching user details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.id) {
      getUserDetailsId(Number(params.id))
    }
  }, [params.id])

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="h-full bg-[#f8fafc] flex justify-center items-center">
      <Card className="w-full max-w-lg shadow-lg border border-gray-200 pt-0">
        <CardHeader className="bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold p-4 text-center">{Number(params.id) === stUser.userId ? "My " : `${userDetails.firstName} ${userDetails.lastName}'s`} Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 mt-5">
          <div>
            <Label className="text-gray-700">User ID</Label>
            <Input
              value={userDetails.userId ?? ""}
              disabled
              className="mt-1 bg-gray-100"
            />
          </div>
          <div>
            <Label className="text-gray-700">User Email</Label>
            <Input
              value={userDetails.email ?? ""}
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
            <div className="flex items-center">
              <Input
                type={showApiKey ? "text" : "password"}
                name="groqApiKey"
                value={
                  showApiKey
                    ? decryptMethod(userDetails.groqApiKey ?? "")
                    : "************"
                }
                className="mt-1 bg-gray-100 mr-1"
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Button
                variant="outline"
                size="icon"
                aria-label="View file"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-gray-700">Created At</Label>
            <Input
              value={new Date(userDetails.createdAt ?? "").toLocaleString()}
              disabled
              className="mt-1 bg-gray-100"
            />
          </div>
          <div>
            <Label className="text-gray-700">Updated At</Label>
            <Input
              value={new Date(userDetails.updatedAt ?? "").toLocaleString()}
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
                  onClick={() => {
                    clearEditMode();
                    setIsEditing(false);
                  }}
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

export default ProfilePage;