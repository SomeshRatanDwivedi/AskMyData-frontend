import type { ChatType } from "@/types";
import { askMyDataApi } from "../instance"


export const saveChat = async (chat: ChatType) => {
  const res = await askMyDataApi.post('/chat/save-chat', chat);
  return res.data;
}

export const editChat = async (chatId: string, chat: ChatType) => {
  const res = await askMyDataApi.put(`/chat/edit-chat/${chatId}`, chat);
  return res.data;
}


export const deleteChat = async (chatId:string) => {
  const res = await askMyDataApi.delete(`/chat/delete-chat/${chatId}`);
  return res.data;
}

export const getChat = async () => {
  const res = await askMyDataApi.get('/chat');
  return res.data;
}