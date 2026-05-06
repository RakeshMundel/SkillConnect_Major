import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Chat from "./Chat";
import ChatList from "./ChatList";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const location = useLocation();

  // 👇 Receive chatId when navigating from profile
  useEffect(() => {
    const stateId = location.state?.chatId;
    const localId = localStorage.getItem('activeChatId');
    
    if (stateId) {
      setActiveChat(stateId);
      localStorage.setItem('activeChatId', stateId);
    } else if (localId) {
      setActiveChat(localId);
    }
  }, [location.state]);

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      <ChatList onSelectChat={setActiveChat} />

      {activeChat ? (
        <Chat chatId={activeChat} />
      ) : (
        <div style={{ margin: "auto" }}>
          <h3>Select a chat</h3>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
