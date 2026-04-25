import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { AuthContext } from "../../Context/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  updateDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { FiMoreVertical, FiPhone, FiSend } from "react-icons/fi";
import { sendMessage } from "./sendMessage";
import "./Chat.css";

const Chat = ({ chatId }) => {
  const { currentUser, loading } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const [typingUser, setTypingUser] = useState(false);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  if (loading) return <h3 className="chat-state">Loading...</h3>;
  if (!currentUser) return <h3 className="chat-state">Please login to use chat</h3>;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const unsub = onSnapshot(doc(db, "chats", chatId), (snap) => {
      if (!snap.exists()) return;

      const typingData = snap.data().typing || {};
      const isOtherTyping = Object.entries(typingData).some(
        ([uid, isTyping]) => uid !== currentUser.uid && isTyping
      );

      setTypingUser(isOtherTyping);
    });

    return () => unsub();
  }, [chatId, currentUser]);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((messageDoc) => ({
        id: messageDoc.id,
        ...messageDoc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const markSeen = async () => {
      const q = query(
        collection(db, "chats", chatId, "messages"),
        where("senderId", "!=", currentUser.uid),
        where("seen", "==", false)
      );

      const snap = await getDocs(q);

      snap.forEach((docSnap) => {
        updateDoc(doc(db, "chats", chatId, "messages", docSnap.id), {
          seen: true,
        });
      });
    };

    markSeen();
  }, [chatId, currentUser]);

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const fetchUser = async () => {
      const chatSnap = await getDoc(doc(db, "chats", chatId));
      if (!chatSnap.exists()) return;

      const otherUserId = chatSnap
        .data()
        .members.find((id) => id !== currentUser.uid);

      const userSnap = await getDoc(doc(db, "users", otherUserId));

      if (userSnap.exists()) {
        setChatUser(userSnap.data());
      }
    };

    fetchUser();
  }, [chatId, currentUser]);

  const handleTyping = async (value) => {
    setText(value);

    await updateDoc(doc(db, "chats", chatId), {
      [`typing.${currentUser.uid}`]: true,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      await updateDoc(doc(db, "chats", chatId), {
        [`typing.${currentUser.uid}`]: false,
      });
    }, 400);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage(chatId, text, currentUser.uid);

    await updateDoc(doc(db, "chats", chatId), {
      [`typing.${currentUser.uid}`]: false,
    });

    setText("");
  };

  return (
    <section className="chat-container">
      <div className="chat-header">
        <div className="chat-header-main">
          <div className="chat-avatar-shell">
            {chatUser?.photoURL ? (
              <img
                src={chatUser.photoURL}
                alt={chatUser?.name || "User"}
                className="chat-avatar-image"
              />
            ) : (
              <span>{(chatUser?.name || "C").charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="chat-header-text">
            <h3>{chatUser?.name || "Chat"}</h3>
            <p>{typingUser ? "Typing..." : "Professional support chat"}</p>
          </div>
        </div>

        <div className="chat-header-actions">
          <button type="button" className="chat-icon-button" aria-label="Call">
            <FiPhone />
          </button>
          <button type="button" className="chat-icon-button" aria-label="More options">
            <FiMoreVertical />
          </button>
        </div>
      </div>

      {typingUser && (
        <p className="chat-typing-indicator">The professional is typing...</p>
      )}

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty-state">
            <h4>No messages yet</h4>
            <p>Start the conversation and discuss your service needs.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.senderId === currentUser.uid ? "sent" : "received"
            }`}
          >
            <div className="message-content">{msg.text}</div>

            {msg.senderId === currentUser.uid && (
              <div className="message-status">{msg.seen ? "Seen" : "Delivered"}</div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              handleSend();
            }
          }}
          placeholder="Type your message here..."
        />
        <button onClick={handleSend} aria-label="Send message">
          <FiSend />
        </button>
      </div>
    </section>
  );
};

export default Chat;
