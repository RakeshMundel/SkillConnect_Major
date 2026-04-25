import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./ChatList.css";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";

const ChatList = ({ onSelectChat, activeChat }) => {
  const { currentUser } = useContext(AuthContext);
  const [chats, setChats] = useState([]);

  const getOtherUser = async (members) => {
    const otherId = members.find((id) => id !== currentUser.uid);
    const snap = await getDoc(doc(db, "users", otherId));
    return snap.data();
  };

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid),
      orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      const list = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const user = await getOtherUser(data.members);

          return {
            id: docSnap.id,
            ...data,
            user,
          };
        })
      );
      setChats(list);
    });

    return () => unsub();
  }, [currentUser]);

  return (
    <aside className="chatlist-container">
      <div className="chatlist-header">
        <h2>Chats</h2>
        <p>Your recent conversations</p>
      </div>

      <div className="chatlist-scroll">
        {chats.length === 0 && <p className="chatlist-empty">No chats yet</p>}

        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`chatlist-item ${activeChat === chat.id ? "active" : ""}`}
          >
            {chat.user?.photoURL ? (
              <img
                src={chat.user.photoURL}
                alt={chat.user?.name || "User"}
                className="chat-avatar"
              />
            ) : (
              <div className="chat-avatar chat-avatar-fallback">
                {(chat.user?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}

            <div className="chat-info">
              <p className="chat-name">{chat.user?.name || "User"}</p>
              <p className="chat-last">{chat.lastMessage || "No messages yet"}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatList;
