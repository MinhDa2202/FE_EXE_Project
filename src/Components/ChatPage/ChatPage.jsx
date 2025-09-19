import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import s from "./ChatPage.module.scss";

const ChatPage = () => {
  const location = useLocation();

  // Lấy thông tin từ navigation state
  const { productData, sellerId, sellerName } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);

  const API_BASE_URL = "https://localhost:7235";

  useEffect(() => {
    loadMessages();
    loadContacts();
  }, []);


  const loadMessages = async () => {
    if (!sellerId || !productData?.id) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/Messenger?userId=${sellerId}&productId=${productData.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error("Failed to load messages:", response.status);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading messages:", error);
      setIsLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/Messenger/contacts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const contactNames = await response.json();
        const contactObjects = contactNames.map((name, index) => ({
          id: index + 1,
          name: name,
          lastActive: "Hoạt động gần đây",
        }));
        setContacts(contactObjects);
      } else {
        console.error("Failed to load contacts:", response.status);
      }

      if (sellerName) {
        setCurrentContact({
          id: sellerId,
          name: sellerName,
          lastActive: "Hoạt động gần đây",
        });
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const messageData = {
        receiverId: sellerId,
        productId: productData?.id,
        content: newMessage.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/api/Messenger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setNewMessage("");
        await loadMessages();
      } else {
        console.error("Failed to send message:", response.status);
        alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Đã xảy ra lỗi khi gửi tin nhắn.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    console.log(`Deleting message with ID: ${messageId}`);
  };


  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleContactClick = (contact) => {
    setCurrentContact(contact);
  };

  return (
    <div className={s.chatPage}>
      {/* Sidebar */}
      <div className={s.sidebar}>
        <div className={s.sidebarHeader}>
          <h2>Messenger</h2>
        </div>

        <div className={s.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm trong Messenger"
            className={s.searchInput}
          />
        </div>

        <div className={s.contactsList}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`${s.contactItem} ${
                currentContact?.id === contact.id ? s.active : ""
              }`}
              onClick={() => handleContactClick(contact)}
            >
              <div className={s.contactAvatar}>
                {/* Placeholder for avatar, can be an image or initial */}
                {contact.name ? contact.name.charAt(0).toUpperCase() : ""}
              </div>
              <div className={s.contactInfo}>
                <h4>{contact.name}</h4>
                <p>{contact.lastActive}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={s.chatArea}>
        {currentContact ? (
          <>
            {/* Chat Header */}
            <div className={s.chatHeader}>
              <div className={s.chatUserInfo}>
                <div className={s.chatAvatar}>
                  {/* Placeholder for chat avatar, can be an image or initial */}
                  {currentContact.name ? currentContact.name.charAt(0).toUpperCase() : ""}
                </div>
                <div>
                  <h3>{currentContact.name}</h3>
                  <p>{currentContact.lastActive}</p>
                </div>
              </div>
              {productData && (
                <div className={s.productInfo}>
                  <img
                    src={productData.ImageUrls?.[0] || "/api/placeholder/40/40"}
                    alt={productData.Title}
                    className={s.productImage}
                  />
                  <div>
                    <h4>{productData.Title}</h4>
                  </div>
                </div>
              )}
              <button className={s.moreButton}>⋮</button>
            </div>

            {/* Messages */}
            <div className={s.messagesContainer}>
              {isLoading ? (
                <div className={s.loadingMessage}>Đang tải tin nhắn...</div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`${s.message} ${
                        message.isMine ? s.myMessage : s.theirMessage
                      }`}
                    >
                      <div className={s.messageContent}>
                        <p>{message.content}</p>
                      </div>
                      <span className={s.messageTime}>
                        {formatTime(message.sentAt)}
                      </span>
                      {message.isMine && (
                        <button
                          className={s.deleteButton}
                          onClick={() => deleteMessage(message.id)}
                          title="Xóa tin nhắn"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Message Input */}
            <div className={s.messageInput}>
              <form onSubmit={sendMessage} className={s.inputForm}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Aa"
                  className={s.textInput}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className={s.sendButton}
                  disabled={isLoading || !newMessage.trim()}
                >
                  ➤
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className={s.noChat}>
            <h3>Chọn một cuộc trò chuyện để bắt đầu</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
