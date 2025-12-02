import {useCallback, useEffect, useState } from "react";
import type { UserLoginFormValueType, UserRegisterFormValueType } from "../../types";
import { login, signup } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { encryptMethod } from "@/utility";
import useUserStore from "@/stores/user.store";
import { useShallow } from 'zustand/react/shallow'

const LoginPage = () => {
  const { stFnUpdateUser, stUser } = useUserStore(useShallow((state) => ({ stFnUpdateUser: state.stFnUpdateUser, stUser: state.stUser })))
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = useCallback(async (formValue: UserLoginFormValueType) => {
    try {
      setLoading(true);
      const encrypted = encryptMethod(formValue.password);
      // Perform login logic here, e.g., API call
      const res = await login({ ...formValue, password: encrypted });
      if (res.success) {
        toast.success("Login successful!");
        stFnUpdateUser({ ...res.user, accessToken: res.accessToken })
        return navigate("/app");
      } else {
        toast.error("Login failed: " + res.message);
        setLoading(false);
      }
    } catch (error: unknown) {
      setLoading(false);
      console.error("Error while login: ", error)
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Login failed");
    }
  }, [navigate, stFnUpdateUser]);

  const handleSignup = useCallback(async (formValue: UserRegisterFormValueType) => {
    try {
      // Perform signup logic here, e.g., API call
      setLoading(true);
      formValue = { ...formValue, password: encryptMethod(formValue.password) }
      const res = await signup(formValue);
      if (res.success) {
        toast.success("OTP sent to your email");
        navigate(`/auth/verify-otp?email=${formValue.email}&expirey=${res.data}`);
      } else {
        toast.error("Signup failed: " + res.message);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Signup failed");
    }
  }, [navigate]);

  const handleShowPassword = useCallback(() => {
    setShowLogin((prev) => !prev)
  }, [])

  useEffect(() => {
    if (stUser?.accessToken) {
      navigate("/app");
    }
  }, [stUser, navigate]);

  return showLogin ? (
    <Login onLogin={handleLogin} switchToSignup={handleShowPassword} loading={loading} />
  ) : (
    <Signup onSignup={handleSignup} switchToLogin={handleShowPassword} loading={loading} />
  );
}

export default LoginPage;