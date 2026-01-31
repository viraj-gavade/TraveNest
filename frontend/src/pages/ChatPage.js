import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import { getChatResponse } from '../services/travelService';
import { useTravelContext } from '../context/TravelContext';

const ChatPage = () => {
  const { selectedDestination, chatHistory, addChatMessage } = useTravelContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    // Welcome message on first visit
    if (chatHistory.length === 0) {
      addChatMessage(
        "Hello! I'm your local travel guide. I can help you with:\n\n• One-day itineraries\n• Best local food spots\n• Hidden gems and secret places\n• Budget-friendly tips\n• Family-friendly activities\n• Safety advice\n\nWhat would you like to know?",
        'assistant'
      );
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    addChatMessage(userMessage, 'user');
    
    // Get AI response
    setIsLoading(true);
    try {
      const response = await getChatResponse(userMessage, selectedDestination?.id);
      addChatMessage(response, 'assistant');
    } catch (error) {
      console.error('Error getting chat response:', error);
      addChatMessage(
        "I'm sorry, I'm having trouble connecting right now. Please try again!",
        'assistant'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What should I do in one day?",
    "Best local food nearby?",
    "Hidden gems tourists miss?",
    "Budget-friendly tips?",
  ];

  const handleSuggestionClick = (question) => {
    setInput(question);
  };

  return (
    <Layout>
      <section className="px-6 md:px-12 lg:px-24 py-12 min-h-[calc(100vh-200px)]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta/10 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-terracotta" />
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ocean tracking-tight mb-3">
              Ask a Local Guide
            </h1>
            <p className="font-sans text-lg text-stone/80">
              Get personalized travel advice and insider tips
            </p>
            {selectedDestination && (
              <p className="font-sans text-sm text-terracotta mt-2">
                Currently helping you explore {selectedDestination.name}
              </p>
            )}
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-stone/10 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 450px)', minHeight: '500px' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" data-testid="chat-messages">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] ${
                      chat.sender === 'user'
                        ? 'bg-ocean text-white rounded-2xl rounded-tr-sm'
                        : 'bg-sand text-ocean rounded-2xl rounded-tl-sm'
                    } px-5 py-4`}
                    data-testid={`message-${chat.sender}`}
                  >
                    {chat.sender === 'assistant' && (
                      <div className="font-handwriting text-sm mb-1 opacity-70">Local Guide</div>
                    )}
                    <p className="font-sans leading-relaxed whitespace-pre-wrap text-sm">
                      {chat.message}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-sand text-ocean rounded-2xl rounded-tl-sm px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-sans text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {chatHistory.length <= 2 && (
              <div className="px-6 py-4 border-t border-stone/10 bg-sand/30">
                <p className="font-sans text-xs text-stone/60 mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(question)}
                      data-testid={`suggestion-${idx}`}
                      className="px-3 py-1.5 bg-white border border-stone/20 rounded-full text-xs font-sans text-stone hover:bg-ocean hover:text-white hover:border-ocean transition-all duration-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-6 border-t border-stone/10">
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask me anything about your trip..."
                  data-testid="chat-input"
                  rows={1}
                  className="flex-1 resize-none font-sans text-base px-4 py-3 rounded-xl border border-stone/20 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean bg-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  data-testid="send-button"
                  className="flex-shrink-0 bg-terracotta text-white p-3 rounded-xl hover:bg-terracotta/90 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="font-sans text-xs text-stone/50 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ChatPage;
