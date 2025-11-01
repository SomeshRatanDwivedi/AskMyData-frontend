//This file handle the ai api calling

import { askMyDataApi } from "../instance"

export const askQuestion = async (question: string) => {
  const res = await askMyDataApi.post('/ai/ask', {question});
  return res.data;
}