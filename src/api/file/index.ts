import { askMyDataApi } from "../instance"

export const uploadFile = async (formValue: FormData) => {
  const res = await askMyDataApi.post("/file/upload", formValue);
  return res.data;
}

export const getUserFiles = async (id?: number | null) => {
  let url = '/file/get-user-files';
  if (id) {
    url+=`/${id}`;
  }
  const res = await askMyDataApi.get(url);
  return res.data;
}