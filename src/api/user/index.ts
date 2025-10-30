import type {UserLoginFormValueType, UserRegisterFormValueType } from "@/types";
import { askMyDataApi } from "../instance";
// User Authentication APIs

/**
 * User login
 * @param userInfo - User information
 * @returns token and user info
 */
export const login = async (userInfo: UserLoginFormValueType) => {
  const response = await askMyDataApi.post("user/login", userInfo);
  return response.data;
};


/** * User signup
 * @param userInfo - User information
 * @returns success message
 */
export const signup = async (userInfo: UserRegisterFormValueType) => {
  const response = await askMyDataApi.post("user/register", userInfo);
  return response.data;
};