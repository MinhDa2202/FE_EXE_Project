import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import s from './ChatPage.module.scss';

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  // Lấy thông tin từ navigation state
  const { productData, sellerId, sellerName } = location.state || {};
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);

  // API Base URL
  const API_BASE_URL = 'https://localhost:7235';

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Load messages khi component mount
    loadMessages();
    loadContacts();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new message
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!sellerId || !productData?.id) return;
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${API_BASE_URL}/api/Messenger?userId=${sellerId}&productId=${productData.id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to load messages:', response.status);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setIsLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/Messenger/contacts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const contactNames = await response.json();
        // Convert contact names to objects (since API only returns names)
        const contactObjects = contactNames.map((name, index) => ({
          id: index + 1,
          name: name,
          lastActive: "Hoạt động gần đây"
        }));
        setContacts(contactObjects);
      } else {
        console.error('Failed to load contacts:', response.status);
      }
      
      if (sellerName) {
        setCurrentContact({
          id: sellerId,
          name: sellerName,
          lastActive: "Hoạt động gần đây"
        });
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const messageData = {
        receiverId: sellerId,
        productId: productData?.id,
        content: newMessage.trim()
      };

      console.log("Sending message:", messageData);

      const response = await fetch(`${API_BASE_URL}/api/Messenger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        // Sau khi gửi thành công, reload messages để cập nhật UI
        setNewMessage('');
        await loadMessages();
      } else {
        console.error('Failed to send message:', response.status);
        alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Đã xảy ra lỗi khi gửi tin nhắn.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    console.log(`Deleting message with ID: ${messageId}`);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleContactClick = (contact) => {
    setCurrentContact(contact);
    // TODO: Load messages for this contact
  };

  return (
    <div className={`${s.chatPage} ${isDarkMode ? s.darkMode : s.lightMode}`}>
      {/* Left Sidebar - Contacts */}
      <div className={s.sidebar}>
        <div className={s.sidebarHeader}>
          <h2>Messenger</h2>
          <button 
            className={s.themeToggle}
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        <div className={s.searchBox}>
          <input 
            type="text" 
            placeholder="Nhập tên để tìm kiếm"
            className={s.searchInput}
          />
        </div>

        <div className={s.filterBox}>
          <button className={s.filterButton}>
            Tất cả
          </button>
          <button className={s.settingsButton}>⚙️</button>
        </div>

        <div className={s.contactsList}>
          {contacts.map(contact => (
            <div 
              key={contact.id}
              className={`${s.contactItem} ${currentContact?.id === contact.id ? s.active : ''}`}
              onClick={() => handleContactClick(contact)}
            >
              <div className={s.contactAvatar}>
                <img src="/api/placeholder/40/40" alt={contact.name} />
              </div>
              <div className={s.contactInfo}>
                <h4>{contact.name}</h4>
                <p>{contact.lastActive}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={s.sidebarFooter}>
          <button className={s.hideButton}>
            🗣️ Ẩn hội thoại
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={s.chatArea}>
        {currentContact ? (
          <>
            {/* Chat Header */}
            <div className={s.chatHeader}>
              <div className={s.chatUserInfo}>
                <img 
                  src="/api/placeholder/40/40" 
                  alt={currentContact.name}
                  className={s.chatAvatar}
                />
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

            {/* Messages Area */}
            <div className={s.messagesContainer}>
              {isLoading ? (
                <div className={s.loadingMessage}>Đang tải tin nhắn...</div>
              ) : (
                <>
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={`${s.message} ${message.isMine ? s.myMessage : s.theirMessage}`}
                    >
                      <div className={s.messageContent}>
                        <p>{message.content}</p>
                        <span className={s.messageTime}>
                          {formatTime(message.sentAt)}
                        </span>
                      </div>
                      {message.isMine && (
                        <button 
                          className={s.deleteButton}
                          onClick={() => deleteMessage(message.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className={s.quickActions}>
              <button className={s.quickActionButton}>
                Điện thoại này còn không?
              </button>
              <button className={s.quickActionButton}>
                Bạn có ship hàng không?
              </button>
              <button className={s.quickActionButton}>
                Sản phẩm còn bảo hành không?
              </button>
            </div>

            {/* Message Input */}
            <div className={s.messageInput}>
              <div className={s.inputActions}>
                <button className={s.actionButton}>🖼️</button>
                <button className={s.actionButton}>🎥</button>
                <button className={s.actionButton}>📍</button>
                <button className={s.actionButton}>💬</button>
              </div>
              
              <form onSubmit={sendMessage} className={s.inputForm}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn"
                  className={s.textInput}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className={s.sendButton}
                  disabled={isLoading || !newMessage.trim()}
                >
                  Gửi
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