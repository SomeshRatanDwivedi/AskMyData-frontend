import { askMyDataApi } from "../instance"

export const uploadFile = async (formValue: FormData) => {
  const res = await askMyDataApi.post("/file/upload", formValue);
  return res.data;
}

export const getUserFiles = async () => {
  const res = await askMyDataApi.get("/file/get-user-files");
  return res.data;
}