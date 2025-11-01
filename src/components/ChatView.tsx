
import React, { useState, useRef, useEffect, memo } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { ChatType, Message } from '@/types';
import { askQuestion } from '@/api/ai';
import { handleCatchBlockError } from '@/utility';
import { toast } from 'react-toastify';
import { getChat, saveChat } from '@/api/chat/intex';
import { useCallback } from 'react';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Hi there!\n\nHow can I assist you today?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessageError = () => {
    const errorMessage = 'Sorry, an error occurred while getting a response. Please check your API key and network connection.';
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1] = { role: 'model', content: errorMessage, isThinking: false };
      return newMessages;
    });
  };

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim() || isLoading ) return;

    setIsLoading(true);

    const userMessage: Message = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage, { role: 'model', content: '', isThinking: true }]);

    try {
      const res = await askQuestion(prompt);
      if (res?.success) {
        const newChat = {
          question: prompt,
          answer: res.data,
        }
        await saveChatHistory(newChat);
      } else {
        toast.error(res?.message);
        handleMessageError();
      }
    } catch (error) {
      handleCatchBlockError(error,"Error sending message:")
      handleMessageError();
    } finally {
      setIsLoading(false);
    }
  };

  const getChatHistory = useCallback(async() => {
    try {
      const res = await getChat();
      if (res?.success) {
        if (res.data.length > 0) {
          setMessages(res?.data);
        }
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      console.log("Erro in getChatHistory: ", err);
      handleCatchBlockError(err, "Error getting chat history:")
    }
  },[])

  const saveChatHistory = async (chat: ChatType) => {
    try {
      const res = await saveChat(chat);
      if (res?.success) {
        const modelMessage: Message = { ...res.data, isThinking: false };
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = modelMessage;
          return newMessages;
        });
      } else {
        toast.error(res?.message)
      } 
    } catch (err) {
      console.log("Erro in saveChatHistory: ", err);
      handleCatchBlockError(err, "Error saving chat history:")
    }
  }


  useEffect(() => {
      getChatHistory();
  }, [getChatHistory])

  useEffect(scrollToBottom, [messages]);
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl">
          <div className="space-y-8">
            {messages.map((msg, ind) => (
              <ChatMessage key={ind} message={msg}  refreshChatHistory={getChatHistory}/>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="shrink-0 p-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default memo(ChatView);