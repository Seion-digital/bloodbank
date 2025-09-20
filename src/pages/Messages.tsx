import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { supabase } from '../supabaseClient';
import { 
  MessageCircle, 
  Send, 
  Search, 
  Phone, 
  Video,
  MoreVertical,
  Heart,
  Clock
} from 'lucide-react';
import { User, Message } from '../types';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { messages, sendMessage, users, loading } = useApp();
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);

  useEffect(() => {
    setLocalMessages(messages);

    const channel = supabase.channel('public:messages')
      .on<Message>('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setLocalMessages(prevMessages => [...prevMessages, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messages]);

  const conversations = useMemo(() => {
    if (!user) return [];
    const conversationMap = new Map<string, { otherUser: User, lastMessage: Message }>();

    localMessages.forEach(message => {
      const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
      const otherUser = users.find(u => u.id === otherUserId);

      if (otherUser) {
        const existing = conversationMap.get(otherUserId);
        if (!existing || new Date(message.timestamp) > new Date(existing.lastMessage.timestamp)) {
          conversationMap.set(otherUserId, { otherUser, lastMessage: message });
        }
      }
    });

    return Array.from(conversationMap.values());
  }, [localMessages, user, users]);

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    return conversations.find(c => c.otherUser.id === selectedConversationId);
  }, [conversations, selectedConversationId]);

  const selectedConversationMessages = useMemo(() => {
    if (!selectedConversationId || !user) return [];
    return localMessages
      .filter(m =>
        (m.sender_id === user.id && m.receiver_id === selectedConversationId) ||
        (m.sender_id === selectedConversationId && m.receiver_id === user.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [localMessages, selectedConversationId, user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversationId && user && selectedConversation) {
      await sendMessage({
        receiver_id: selectedConversationId,
        content: newMessage,
        request_id: selectedConversation.lastMessage.request_id,
      });
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversationUser = users.find(u => u.id === selectedConversationId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-200px)]">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(({ otherUser, lastMessage }) => (
              <div
                key={otherUser.id}
                onClick={() => setSelectedConversationId(otherUser.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversationId === otherUser.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {otherUser.full_name.charAt(0)}
                    </div>
                    {otherUser.is_active && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {otherUser.full_name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {lastMessage.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversationId ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedConversationUser?.full_name.charAt(0)}
                      </div>
                      {selectedConversationUser?.is_active && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedConversationUser?.full_name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedConversationUser?.is_active ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedConversationMessages.map((message) => {
                  const isOwnMessage = message.sender_id === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                        {!isOwnMessage && (
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {selectedConversationUser?.full_name.charAt(0)}
                          </div>
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <button className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors">
                    <Heart className="h-4 w-4" />
                    <span>Accept Donation</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
                    <Clock className="h-4 w-4" />
                    <span>Schedule Meeting</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};