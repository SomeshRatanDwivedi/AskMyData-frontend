import React, { memo, useState } from "react";
import type { UserRegisterFormValueErrorType, UserRegisterFormValueType } from "../types";
import { validateUserForm } from "../utility";
import {USER_INPUTS_INFO_REGISTER } from "@/constants";
import { Checkbox } from "./ui/checkbox";

interface SignupProps {
  loading?: boolean;
  onSignup: (formValue: UserRegisterFormValueType) => void;
  switchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, switchToLogin, loading }) => {
  const [formValue, setFormValue] = useState<UserRegisterFormValueType>({
    email: "",
    firstName: "",
    lastName: "",
    password: ""
  });

  const [error, setError] = useState<UserRegisterFormValueErrorType>({
    emailError: "",
    firstNameError: "",
    lastNameError: "",
    passwordError: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValue.firstName.trim() && formValue.lastName.trim() && formValue.password.trim()) {
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
      onSignup(formValue);
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [`${name}Error`]: "" }));
  }
  const getInputType = (inputName: string, inputType: string) => {
    if (inputName === "password" && showPassword) return "text";
    return inputType;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Signup</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-80">
        {
          USER_INPUTS_INFO_REGISTER.map((ele) => (
            <div key={ele.name} className="w-full">
              <input
                id={ele.id}
                name={ele.name}
                type={getInputType(ele.name, ele.type)}
                placeholder={ele.placeHolder}
                value={formValue[ele.name as keyof UserRegisterFormValueType]}
                onChange={handleInputChange}
                className={ele.className}
                autoComplete={ele.autoComplete}
              />
              {/* For showing error messages */}
              {error[`${ele.name}Error` as keyof UserRegisterFormValueErrorType] && (
                <p className="text-red-500 text-sm">
                  {error[`${ele.name}Error` as keyof UserRegisterFormValueErrorType]}
                </p>
              )}
            </div>
          ))
        }
        <div className="w-full flex items-center">
          <Checkbox
            id="showPassword"
            checked={showPassword}
            onCheckedChange={() => setShowPassword(!showPassword)}
            className="mr-2 data-[state=checked]:bg-green-600 data-[state=checkbg-green-600 data-[state=checked]:text-white"
          /> 
          <label htmlFor="showPassword" className="text-gray-700">Show Password</label>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      <p className="mt-4 text-gray-700">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-blue-600 font-semibold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default memo(Signup);
