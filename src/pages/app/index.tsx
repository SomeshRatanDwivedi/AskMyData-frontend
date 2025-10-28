import ChatView from "@/components/ChatView";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const AskMyDataPage = () => {
  return (
    <div className="flex w-full justify-between h-full bg-(--theme-bg-container) font-sans text-gray-900">
      <Sidebar />
      <main className="flex w-[calc(100%-272px)] flex-col bg-white">
        <Header />
        <ChatView />
      </main>
    </div>
  );
}

export default AskMyDataPage; 