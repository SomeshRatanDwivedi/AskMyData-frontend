
import React, { memo } from 'react';
import {
  BrainIcon,
  ChevronUpIcon,
  ClipboardIcon,
  RefreshCwIcon,
  BotIcon
} from './Icons';
import type { Message } from '@/types';
import { handleCatchBlockError } from '@/utility';
import { deleteChat } from '@/api/chat/intex';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/stores/user.store';
import { CopyIcon } from 'lucide-react';


interface ChatMessageProps {
  message: Message;
  refreshChatHistory: (chatId:string) => void
  regenarateMessage: (chatId: string) => void
}


function RateLimitMessage({ content }: { content: string }) {
  const userId=useUserStore((state) => state.stUser?.userId);
  const navigate = useNavigate();
  return (
    <div className="w-full bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg p-4 my-3 text-sm">
      <strong>Rate limit reached.</strong><br />
      {content}<br />
      Please add your API key in the <span onClick={() => navigate(`/app/profile/${userId}`)} className="font-bold cursor-pointer underline">Profile</span> page.
    </div>
  );
}

const ThinkingBlock: React.FC = () => (
  <div className="flex flex-col space-y-3 p-4 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-600">
    <div className="flex justify-between items-center">
      <div className="flex items-center font-semibold">
        <BrainIcon className="w-5 h-5 mr-2" />
        <span>Ok, let's figure this out:</span>
      </div>
      <ChevronUpIcon className="w-5 h-5" />
    </div>
    <p>Thinking...</p>
    <p>Ok, I'm ready to generate my response:</p>
  </div>
);

const MessageActions: React.FC<ChatMessageProps> = memo(({ message, refreshChatHistory, regenarateMessage }) => {
  const handleDeleteChat = async () => {
    try {
      const res = await deleteChat(message?.id ?? "");
      if (res?.success) {
        toast.success("Chat deleted successfully.");
        refreshChatHistory(message?.id ?? "");
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      console.log("Error in handleDeleteChat: ", err);
      handleCatchBlockError(err, "Error deleting chat:");
    }
  }

  const handleCopyChat = async() => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success("Chat copied to clipboard.");
    } catch (err) {
      console.log("Error in handleCopyChat: ", err);
      toast.error("Error copying chat to clipboard.");
    }
  }
  return (
    <div className="flex items-center space-x-3 text-gray-500 mt-3">
      <button title='Copy' className="hover:text-gray-800" onClick={handleCopyChat}><CopyIcon className="w-4 h-4" /></button>
      {
        message.role ==='model' && message?.id!=="-1" &&
        <>
          <button title='Delete' className="hover:text-gray-800" onClick={handleDeleteChat}><ClipboardIcon className="w-4 h-4" /></button>
          <button title='Re-generate' className="hover:text-gray-800" onClick={() => regenarateMessage(message.id ?? "")}><RefreshCwIcon className="w-4 h-4" /></button>
        </>
      }

    </div>
  )
});

const ChatMessage: React.FC<ChatMessageProps> = ({ message, refreshChatHistory, regenarateMessage }) => {
  const isUser = message.role === 'user';

  const Avatar: React.FC = () => {
    if (isUser) {
      return (
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-600 shrink-0">
          U
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
        <BotIcon className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="flex items-start space-x-4">
      <Avatar />
      <div>
      <div className="flex-1">
        {isUser ? (
          <p className="font-semibold text-gray-800">{message.content}</p>
        ) : (
          <div className="space-y-4">
            {message.isThinking && <ThinkingBlock />}
            {message?.errorType === 'rate-limit' && <RateLimitMessage content={message.content} />}
              {!message?.errorType && message.content ? (
              <div className="prose max-w-none text-gray-800">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={line.trim() === '' ? 'h-4' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>
        )}
      </div>
        {!message.isThinking && !message?.errorType && message.content && <MessageActions message={message} refreshChatHistory={refreshChatHistory} regenarateMessage={regenarateMessage} />}
      </div>
    </div>
  );
};

export default memo(ChatMessage);
