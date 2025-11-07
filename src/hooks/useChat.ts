import { askQuestion } from "@/api/ai";
import { getChat, saveChat, updateChat } from "@/api/chat/intex";
import type { ChatType, Message } from "@/types";
import type { AxiosError } from "axios";
import { useCallback, useState } from "react";


// ----------------------------- useChat Hook --------------------------
export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // helper to append a message
  const appendMessage = useCallback((m: Message) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  // replace a message by id
  const replaceMessage = useCallback((id: string, newMsg: Partial<Message>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...newMsg } : m)));
  }, []);

  const replaceUserMessageId = useCallback((id: string, newId: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, id: newId } : m)));
  }, []);

  // remove message by id
  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const getHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getChat();
      if (res?.success && res.data) {
        // Ensure messages have ids
        if (res.data.length > 0) {
          setMessages(res.data);
        } else {
          setMessages([{
            id: "-1",
            role: 'model',
            content: '👋 Welcome! How can I help you today?',
            isThinking: false,
          }]);
        }

      }
    } catch (err) {
      console.error('getHistory error', err);
    } finally {
      setIsLoading(false)
    }
  }, []);

  const sendMessage = useCallback(
    async (prompt: string, chatId?: string) => {
      if (!prompt.trim()) return;
      if (isLoading) return;
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: prompt,
      };

      const thinkingMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        content: '',
        isThinking: true,
      };

      // optimistic UI update
      appendMessage(userMsg);
      appendMessage(thinkingMsg);

      try {
        const res = await askQuestion(prompt);
        if (res?.success) {
          const modelContent = res.data ?? '';

          // optionally persist the chat server-side
          const record: ChatType = { question: prompt, answer: modelContent };
          let newRecord;
          if (!chatId) {
            try {
              newRecord = await saveChat(record);
            } catch (e) {
              console.warn('saveChat failed', e);
            }
          } else {
            try {
              newRecord = await updateChat(chatId, record);
            } catch (e) {
              console.warn('updateChat failed', e);
            }
          }

          // replace the thinking message with actual model message
          replaceMessage(thinkingMsg.id, { content: modelContent, isThinking: false, id: newRecord?.data?.id });
          replaceUserMessageId(userMsg.id, newRecord?.data?.id);
        } else {
          replaceMessage(thinkingMsg.id, {
            content: res?.message ?? 'Something went wrong',
            isThinking: false,
          });
        }
      } catch (err: unknown) {
        console.error('sendMessage error', err);
        const newErr = err as AxiosError<{ message: string }>;
        if (newErr?.status === 429) {
          replaceMessage(thinkingMsg.id, { content: newErr.response?.data?.message, isThinking: false, errorType: 'rate-limit' });
        } else {
          replaceMessage(thinkingMsg.id, { content: 'Error getting response. Try again.', isThinking: false });
        }

      }
    },
    [appendMessage, replaceMessage, isLoading, replaceUserMessageId]
  );

  const regenerate = useCallback(
    async (messageId: string) => {
      // find the user message associated with this id (in this pattern we assume user-msg then model-msg)
      const idx = messages.findIndex((m) => m.id === messageId);
      if (idx === -1) return;

      // find previous user message before the model message
      const userBefore = [...messages].slice(0, idx + 1).reverse().find((m) => m.role === 'user');
      if (!userBefore) return;

      // remove the model message we're regenerating (optimistic)
      const modelMsg = messages[idx];
      removeMessage(modelMsg.id);

      // call sendMessage with same prompt and treat it as regenerate
      await sendMessage(userBefore.content, messageId);
    },
    [messages, removeMessage, sendMessage]
  );

  return {
    messages,
    isLoading,
    getHistory,
    sendMessage,
    regenerate,
    setMessages, // exposed for advanced use
  } as const;
}

// ----------------------------- ChatMessage --------------------------

