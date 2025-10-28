
import React, { useState, useRef, useEffect } from 'react';
// import { GoogleGenAI, Chat } from '@google/genai';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { Message } from '@/types';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Hi there!\n\nHow can I assist you today?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   try {
  //     const apiKey = process.env.API_KEY;
  //     if (!apiKey) {
  //       console.error("API_KEY environment variable not set.");
  //       setMessages(prev => [...prev, { role: 'model', content: 'Configuration error: API key is missing.' }]);
  //       return;
  //     }
  //     const ai = new GoogleGenAI({ apiKey });
  //     chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash' });
  //   } catch (e) {
  //     console.error(e);
  //     setMessages(prev => [...prev, { role: 'model', content: 'An error occurred during initialization.' }]);
  //   }
  // }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim() || isLoading || !chatRef.current) return;

    setIsLoading(true);

    const userMessage: Message = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage, { role: 'model', content: '', isThinking: true }]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: prompt });
      let fullResponse = '';
      let firstChunk = true;

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;

        if (firstChunk) {
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', content: fullResponse, isThinking: false };
            return newMessages;
          });
          firstChunk = false;
        } else {
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = fullResponse;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = 'Sorry, an error occurred while getting a response. Please check your API key and network connection.';
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: 'model', content: errorMessage, isThinking: false };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl">
          <div className="space-y-8">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
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

export default ChatView;