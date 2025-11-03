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

export const deleteUserFiles = async (userId: number, fileId: string) => {
  let url = '/file/delete-file';
  if (userId) {
    url += `/${userId}`;
  }
  if (fileId) {
    url += `/${fileId}`;
  }
  const res = await askMyDataApi.delete(url);
  return res.data;
}