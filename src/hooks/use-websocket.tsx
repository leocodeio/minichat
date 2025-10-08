"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
  replyTo?: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  };
}

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>; // Set of online user IDs
  connect: () => void;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string, replyToId?: string) => void;
  markMessageRead: (messageId: string) => void;
  typingUsers: Record<string, string[]>; // chatId -> userIds
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  onNewMessage: (callback: (message: Message) => void) => () => void;
  onMessageRead: (callback: (data: { messageId: string; userId: string }) => void) => () => void;
  onUserTyping: (callback: (data: { userId: string; chatId: string; isTyping: boolean }) => void) => () => void;
  onNotification: (callback: (data: { type: string; chatId: string; messageId: string }) => void) => () => void;
  onUserOnline: (callback: (data: { userId: string }) => void) => () => void;
  onUserOffline: (callback: (data: { userId: string }) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const callbacksRef = useRef<{
    newMessage: ((message: Message) => void)[];
    messageRead: ((data: { messageId: string; userId: string }) => void)[];
    userTyping: ((data: { userId: string; chatId: string; isTyping: boolean }) => void)[];
    notification: ((data: { type: string; chatId: string; messageId: string }) => void)[];
    userOnline: ((data: { userId: string }) => void)[];
    userOffline: ((data: { userId: string }) => void)[];
  }>({
    newMessage: [],
    messageRead: [],
    userTyping: [],
    notification: [],
    userOnline: [],
    userOffline: [],
  });

  const connect = () => {
    if (socket?.connected) return;

      const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000', {
      withCredentials: true, // Send cookies for authentication
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
      setTypingUsers({});
    });

    newSocket.on('new-message', (message: Message) => {
      callbacksRef.current.newMessage.forEach(callback => callback(message));
    });

    newSocket.on('message-read', (data: { messageId: string; userId: string }) => {
      callbacksRef.current.messageRead.forEach(callback => callback(data));
    });

    newSocket.on('user-typing', (data: { userId: string; chatId: string; isTyping: boolean }) => {
      setTypingUsers(prev => {
        const current = prev[data.chatId] || [];
        if (data.isTyping) {
          if (!current.includes(data.userId)) {
            return { ...prev, [data.chatId]: [...current, data.userId] };
          }
        } else {
          return { ...prev, [data.chatId]: current.filter(id => id !== data.userId) };
        }
        return prev;
      });

      callbacksRef.current.userTyping.forEach(callback => callback(data));
    });

    newSocket.on('notification', (data: { type: string; chatId: string; messageId: string }) => {
      callbacksRef.current.notification.forEach(callback => callback(data));
    });

    newSocket.on('user-online', (data: { userId: string }) => {
      setOnlineUsers(prev => new Set(prev).add(data.userId));
      callbacksRef.current.userOnline.forEach(callback => callback(data));
    });

    newSocket.on('user-offline', (data: { userId: string }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
      callbacksRef.current.userOffline.forEach(callback => callback(data));
    });

    newSocket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);
  };

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setTypingUsers({});
      setOnlineUsers(new Set());
    }
  }, [socket]);

  const joinChat = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('join-chat', chatId);
    }
  };

  const leaveChat = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-chat', chatId);
      // Clear typing users for this chat
      setTypingUsers(prev => {
        const updated = { ...prev };
        delete updated[chatId];
        return updated;
      });
    }
  };

  const sendMessage = (chatId: string, content: string, replyToId?: string) => {
    if (socket && isConnected) {
      socket.emit('send-message', { chatId, content, replyToId });
    }
  };

  const markMessageRead = (messageId: string) => {
    if (socket && isConnected) {
      socket.emit('mark-read', { messageId });
    }
  };

  const startTyping = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('typing', { chatId, isTyping: true });
    }
  };

  const stopTyping = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('typing', { chatId, isTyping: false });
    }
  };

  const onNewMessage = (callback: (message: Message) => void) => {
    callbacksRef.current.newMessage.push(callback);
    return () => {
      const index = callbacksRef.current.newMessage.indexOf(callback);
      if (index > -1) {
        callbacksRef.current.newMessage.splice(index, 1);
      }
    };
  };

  const onMessageRead = (callback: (data: { messageId: string; userId: string }) => void) => {
    callbacksRef.current.messageRead.push(callback);
    return () => {
      const index = callbacksRef.current.messageRead.indexOf(callback);
      if (index > -1) {
        callbacksRef.current.messageRead.splice(index, 1);
      }
    };
  };

  const onUserTyping = (callback: (data: { userId: string; chatId: string; isTyping: boolean }) => void) => {
    callbacksRef.current.userTyping.push(callback);
    return () => {
      const index = callbacksRef.current.userTyping.indexOf(callback);
      if (index > -1) {
        callbacksRef.current.userTyping.splice(index, 1);
      }
    };
  };

  const onNotification = (callback: (data: { type: string; chatId: string; messageId: string }) => void) => {
    callbacksRef.current.notification.push(callback);
    return () => {
      const index = callbacksRef.current.notification.indexOf(callback);
      if (index > -1) {
        callbacksRef.current.notification.splice(index, 1);
      }
    };
  };

  const onUserOnline = (callback: (data: { userId: string }) => void) => {
    callbacksRef.current.userOnline.push(callback);
    return () => {
      const index = callbacksRef.current.userOnline.indexOf(callback);
      if (index > -1) {
        callbacksRef.current.userOnline.splice(index, 1);
      }
    };
  };

  const onUserOffline = (callback: (data: { userId: string }) => void) => {
    callbacksRef.current.userOffline.push(callback);
    return () => {
      const index = callbacksRef.current.userOffline.indexOf(callback);
      if (index > -1) {
        callbacksRef.current.userOffline.splice(index, 1);
      }
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value: WebSocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    connect,
    disconnect,
    joinChat,
    leaveChat,
    sendMessage,
    markMessageRead,
    typingUsers,
    startTyping,
    stopTyping,
    onNewMessage,
    onMessageRead,
    onUserTyping,
    onNotification,
    onUserOnline,
    onUserOffline,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}