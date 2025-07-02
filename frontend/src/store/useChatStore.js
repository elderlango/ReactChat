import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  // State
  messages: [],
  users: [
    { id: 1, name: 'Alice Johnson', avatar: '👩‍💼', status: 'online', lastSeen: null },
    { id: 2, name: 'Bob Smith', avatar: '👨‍💻', status: 'away', lastSeen: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 3, name: 'Carol Davis', avatar: '👩‍🎨', status: 'offline', lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 4, name: 'David Wilson', avatar: '👨‍🔬', status: 'online', lastSeen: null },
  ],
  selectedUser: null,
  currentUser: { id: 0, name: 'You', avatar: '😊' },
  isTyping: false,
  typingUsers: [],
  theme: 'light',
  notifications: [],

  // Actions
  setSelectedUser: (user) => set({ selectedUser: user }),
  
  sendMessage: (text) => {
    const { selectedUser, currentUser } = get();
    if (!selectedUser || !text.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: currentUser,
      recipient: selectedUser,
      timestamp: new Date(),
      status: 'sent',
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    // Simulate receiving a reply after a short delay
    setTimeout(() => {
      const replies = [
        "That's interesting! Tell me more.",
        "I see what you mean.",
        "Thanks for sharing that.",
        "Absolutely agree with you!",
        "Let me think about that...",
        "Great point!",
        "I hadn't considered that perspective.",
      ];
      
      const replyMessage = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: selectedUser,
        recipient: currentUser,
        timestamp: new Date(),
        status: 'received',
      };
      
      set((state) => ({
        messages: [...state.messages, replyMessage],
      }));
    }, Math.random() * 3000 + 1000);
  },
  
  setTyping: (isTyping) => set({ isTyping }),
  
  addTypingUser: (user) => {
    set((state) => ({
      typingUsers: [...state.typingUsers.filter(u => u.id !== user.id), user],
    }));
    
    // Remove typing indicator after 3 seconds
    setTimeout(() => {
      set((state) => ({
        typingUsers: state.typingUsers.filter(u => u.id !== user.id),
      }));
    }, 3000);
  },
  
  removeTypingUser: (userId) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter(u => u.id !== userId),
    }));
  },
  
  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  },
  
  addNotification: (message) => {
    const notification = {
      id: Date.now(),
      message,
      timestamp: new Date(),
    };
    
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
    
    // Auto remove notification after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== notification.id),
      }));
    }, 5000);
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
  
  getMessagesForUser: (userId) => {
    const { messages, currentUser } = get();
    return messages.filter(
      msg => 
        (msg.sender.id === currentUser.id && msg.recipient.id === userId) ||
        (msg.sender.id === userId && msg.recipient.id === currentUser.id)
    );
  },
  
  markMessagesAsRead: (userId) => {
    set((state) => ({
      messages: state.messages.map(msg =>
        msg.sender.id === userId ? { ...msg, status: 'read' } : msg
      ),
    }));
  },
  
  updateUserStatus: (userId, status) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId 
          ? { 
              ...user, 
              status, 
              lastSeen: status === 'offline' ? new Date() : null 
            }
          : user
      ),
    }));
  },
}));

export default useChatStore;
