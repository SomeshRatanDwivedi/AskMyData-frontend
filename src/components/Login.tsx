import React, { memo, useState } from "react";
import type { UserLoginFormValueErrorType, UserLoginFormValueType } from "../types";
import { validateUserForm } from "../utility";
import { USER_INPUTS_INFO_LOGIN } from "@/constants";
import { Checkbox } from "./ui/checkbox";
import GoogleLoginButton from "./GoogleLoginButton";

interface LoginProps {
  loading?: boolean;
  onLogin: (formValue: UserLoginFormValueType) => void;
  switchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, switchToSignup, loading }) => {
  const [formValue, setFormValue] = useState<UserLoginFormValueType>({
    email: "",
    password: ""
  });
  const [error, setError] = useState<UserLoginFormValueErrorType>({
    emailError: "",
    passwordError: "",
  });
  const [showPassword, setShowPassword] = useState(false);
 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValue.email.trim() && formValue.password.trim()) {
      const validation = validateUserForm(formValue);
      if (!validation.valid) {
        setError({
          emailError: validation.errors.emailError ?? "",
          passwordError: validation.errors.passwordError ?? ""
        });
        return;
      }
      onLogin(formValue);
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
    <div className="flex flex-col items-center justify-center h-full bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Login</h1>
      <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-80">
        {
          USER_INPUTS_INFO_LOGIN.map((ele) => (
            <div key={ele.name} className="w-full">
              <input
                id={ele.id}
                name={ele.name}
                type={getInputType(ele.name, ele.type)}
                placeholder={ele.placeHolder}
                value={formValue[ele.name as keyof UserLoginFormValueType]}
                onChange={handleInputChange}
                className={ele.className}
                autoComplete={ele.autoComplete}
              />
              {/* For showing error messages */}
              {error[`${ele.name}Error` as keyof UserLoginFormValueErrorType] && (
                <p className="text-red-500 text-sm">
                  {error[`${ele.name}Error` as keyof UserLoginFormValueErrorType]}
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
        <div className="w-full flex justify-between">
          <button
            type="submit"
            className="w-[130px] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <GoogleLoginButton/>
        </div>
      </form>
      <p className="mt-4 text-gray-700">
        Don’t have an account?{" "}
        <button
          onClick={switchToSignup}
          className="text-green-600 font-semibold hover:underline"
        >
          Signup
        </button>
      </p>
    </div>
  );
};

export default memo(Login);
