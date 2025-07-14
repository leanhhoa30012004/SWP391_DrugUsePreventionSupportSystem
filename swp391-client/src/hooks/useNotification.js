import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // API base URL - thay đổi theo environment
  const API_BASE_URL = 'http://localhost:3000/api/notice';
  const SOCKET_URL ='http://localhost:3000';

  // Fetch notifications từ API
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Thêm authorization header nếu cần
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, API_BASE_URL]);

  // Đánh dấu thông báo đã đọc
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Cập nhật state local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError(error.message);
    }
  }, [API_BASE_URL]);

  // Đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}/read-all`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Cập nhật state local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setError(error.message);
    }
  }, [API_BASE_URL, userId]);

  // Tạo thông báo mới
  const createNotification = useCallback(async (data) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating notification:', error);
      setError(error.message);
      throw error;
    }
  }, [API_BASE_URL]);

  // Xử lý thông báo mới từ socket
  const handleNewNotification = useCallback((data) => {
    const newNotification = {
      id: Date.now(), // Hoặc sử dụng ID từ server
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      redirect_url: data.redirect_url,
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Hiển thị toast notification
    showToast(newNotification);
  }, []);

  // Hiển thị toast notification
  const showToast = (notification) => {
    // Tạo custom event để hiển thị toast
    const event = new CustomEvent('showNotificationToast', {
      detail: notification
    });
    window.dispatchEvent(event);
  };

  // Khởi tạo Socket.IO connection
  useEffect(() => {
    if (!userId) return;

    const socketConnection = io(SOCKET_URL, {
      cors: {
        origin: "*",
      }
    });

    socketConnection.on('connect', () => {
      console.log('Socket connected:', socketConnection.id);
      setIsConnected(true);
      
      // Đăng ký user với socket
      socketConnection.emit('register_user', userId);
    });

    socketConnection.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Lắng nghe thông báo mới
    socketConnection.on('system_notification', handleNewNotification);

    setSocket(socketConnection);

    // Cleanup
    return () => {
      socketConnection.disconnect();
    };
  }, [userId, SOCKET_URL, handleNewNotification]);

  // Fetch notifications khi component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isConnected,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    createNotification,
    fetchNotifications
  };
};

export default useNotification;