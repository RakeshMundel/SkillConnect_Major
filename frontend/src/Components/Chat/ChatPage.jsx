import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Chat from "./Chat";
import ChatList from "./ChatList";
import "./Chat.css";

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.chatId) {
      setActiveChat(location.state.chatId);
    }
  }, [location.state]);

  return (
    <div className="chat-page-shell">
      <div className="chat-page-panel">
        <ChatList onSelectChat={setActiveChat} activeChat={activeChat} />

        {activeChat ? (
          <Chat chatId={activeChat} />
        ) : (
          <div className="chat-page-empty">
            <div className="chat-page-empty-card">
              <h3>Select a chat</h3>
              <p>Choose a conversation from the left to connect with a professional.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
