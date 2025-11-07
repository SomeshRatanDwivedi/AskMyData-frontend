import type {UserLoginFormValueType, UserRegisterFormValueType } from "@/types";
import { askMyDataApi } from "../instance";
// User Authentication APIs

/**
 * User login
 * @param userInfo - User information
 * @returns token and user info
 */
export const login = async (userInfo: UserLoginFormValueType) => {
  const response = await askMyDataApi.post("user/login", {}, {
    auth: {
      username: userInfo.email,
      password: userInfo.password
    }
  });
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

export const updateUserProfile = async (userInfo: Partial<UserRegisterFormValueType>) => {
  const response = await askMyDataApi.put("user/edit-profile", userInfo);
  return response.data;
}

export const getAllUsers = async () => {
  const response = await askMyDataApi.get("user/all-users");
  return response.data;
}

export const getUserDetailsByUserId = async (id: number) => {
  const response = await askMyDataApi.get(`user/${id}`);
  return response.data;
}

export const deleteUser = async (userId: number) => {
  const response = await askMyDataApi.delete(`user/${userId}`);
  return response.data;
}

export const enableDisableUser = async (userId: number) => {
  const response = await askMyDataApi.put(`user/${userId}/enable-disable`);
  return response.data;
}

export const makeRemoveAdmin = async (userId: number) => {
  const response = await askMyDataApi.put(`user/${userId}/make-remove-admin`);
  return response.data;
}