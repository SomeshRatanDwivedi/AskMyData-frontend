import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { encryptMethod, handleCatchBlockError, validateUserForm } from "@/utility";
import { signup } from "@/api/user";
import { toast } from "react-toastify";
import type { UserRegisterFormValueErrorType } from "@/types";
import { Checkbox } from "./ui/checkbox";
interface CreateUserModalInterface {
  open: boolean;
  setOpen: (open: boolean) => void;
}
function CreateUserModal({ open, setOpen }: CreateUserModalInterface) {
  const [formValue, setFormValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const {firstName, lastName, email, password } = formValue;
  const [error, setError] = useState<UserRegisterFormValueErrorType>({
    emailError: "",
    firstNameError: "",
    lastNameError: "",
    passwordError: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [`${name}Error`]: "" }));
  }
  const createUser = async () => {
    try {
      if (firstName.trim() && lastName.trim() && email.trim() && password.trim()) {
        let formValue = { firstName, lastName, email, password }
        const validation = validateUserForm(formValue);
        if (!validation.valid) {
          setError({
            emailError: validation.errors.emailError ?? "",
            firstNameError: validation.errors.firstNameError ?? "",
            lastNameError: validation.errors.lastNameError ?? "",
            passwordError: validation.errors.passwordError ?? ""
          });
          return;
        }
        formValue = { ...formValue, password: encryptMethod(formValue.password) }
        const res = await signup(formValue);
        if (res?.success) {
          setOpen(false);
          toast.success("User created successfully.");
        } else {
          toast.error(res.message)
        }
      } else {
        toast.error("Please fill all fields.")
      }
      
    } catch (err) {
      console.error("Failed to create user:", err);
      handleCatchBlockError(err, "Failed to create user:");
    }
  };

  useEffect(() => {
    if (!open) {
      setFormValue({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      })
      setShowPassword(false);
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-100">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="mb-1">First Name</Label>
            <Input name="firstName" value={firstName} onChange={handleInputChange} />
          </div>
          {error.firstNameError && (
            <p className="text-red-500 text-sm">
              {error.firstNameError}
            </p>
          )}
          <div>
            <Label className="mb-1">Last Name</Label>
            <Input name="lastName" value={lastName} onChange={handleInputChange} />
          </div>
          {error.lastNameError && (
            <p className="text-red-500 text-sm">
              {error.lastNameError}
            </p>
          )}
          <div>
            <Label className="mb-1">Email</Label>
            <Input name="email" type="email" value={email} onChange={handleInputChange} autoComplete="off" />
          </div>
          {error.emailError && (
            <p className="text-red-500 text-sm">
              {error.emailError}
            </p>
          )}
          <div>
            <Label className="mb-1">Password</Label>
            <Input name="password" type={showPassword ? "text" : "password"} value={password} onChange={handleInputChange} autoComplete="new-password" />
          </div>
          {error.passwordError && (
            <p className="text-red-500 text-sm">
              {error.passwordError}
            </p>
          )}
          <div className="w-full flex items-center">
            <Checkbox
              id="showPassword"
              checked={showPassword}
              onCheckedChange={() => setShowPassword(!showPassword)}
              className="mr-2 data-[state=checked]:bg-green-600 data-[state=checkbg-green-600 data-[state=checked]:text-white"
            />
            <label htmlFor="showPassword" className="text-gray-700">Show Password</label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={createUser} className="bg-indigo-500 text-white hover:bg-indigo-600">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CreateUserModal;