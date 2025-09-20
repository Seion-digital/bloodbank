import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useApp } from '../context/AppContext';
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
import { User } from '../types';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { messages, sendMessage, markMessageAsRead } = useApp();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<{[key: string]: User}>({}); // To cache user profiles

  useEffect(() => {
    const recipientId = searchParams.get('recipient');
    if (recipientId) {
      setSelectedConversationId(recipientId);
    }
  }, [searchParams]);

  const conversations = useMemo(() => {
    const convs: { [key: string]: any } = {};
    messages.forEach(msg => {
      const otherPartyId = msg.senderId === user?.id ? msg.receiverId : msg.senderId;
      if (!convs[otherPartyId]) {
        convs[otherPartyId] = {
          id: otherPartyId,
          participantId: otherPartyId,
          lastMessage: msg.content,
          lastMessageTime: msg.timestamp,
          unreadCount: 0,
        };
      }
      if (!msg.isRead && msg.receiverId === user?.id) {
        convs[otherPartyId].unreadCount++;
      }
      if (new Date(msg.timestamp) > new Date(convs[otherPartyId].lastMessageTime)) {
        convs[otherPartyId].lastMessage = msg.content;
        convs[otherPartyId].lastMessageTime = msg.timestamp;
      }
    });
    return Object.values(convs).sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  }, [messages, user?.id]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      const userIds = conversations.map(c => c.participantId).filter(id => !users[id]);
      if (userIds.length === 0) return;

      const { data, error } = await supabase.from('users').select('*').in('id', userIds);

      if (error) {
        console.error("Error fetching user profiles for messages:", error);
      } else {
        const newUsers = data.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as {[key: string]: User});
        setUsers(prev => ({ ...prev, ...newUsers }));
      }
    };

    if (conversations.length > 0) {
      fetchUserProfiles();
    }
  }, [conversations]);

  const selectedConversationMessages = useMemo(() => {
    if (!selectedConversationId) return [];
    return messages.filter(
      msg =>
        (msg.senderId === user?.id && msg.receiverId === selectedConversationId) ||
        (msg.senderId === selectedConversationId && msg.receiverId === user?.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedConversationId, user?.id]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversationId) {
      const messageData = {
        receiverId: selectedConversationId,
        content: newMessage,
        // This is a simplification. In a real app, you'd associate the message with a specific request.
        requestId: messages.find(m => m.senderId === selectedConversationId || m.receiverId === selectedConversationId)?.requestId || '',
      };
      await sendMessage(messageData);
      setNewMessage('');
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    // Mark messages as read
    selectedConversationMessages.forEach(msg => {
      if (!msg.isRead && msg.receiverId === user?.id) {
        markMessageAsRead(msg.id);
      }
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(conv =>
    users[conv.participantId]?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversationUserData = selectedConversationId ? users[selectedConversationId] : null;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-200px)]">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* ... Header and Search ... */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversationId === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {users[conversation.participantId]?.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {users[conversation.participantId]?.fullName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
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
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedConversationUserData?.fullName}
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedConversationMessages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`px-4 py-2 rounded-2xl ${isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-200' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">Select a conversation</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};