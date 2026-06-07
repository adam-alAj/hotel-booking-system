import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X, Minus, Maximize2, Bot, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from './aiService';

const AiChatWidget = ({ token = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your EliteReserve Intelligent Assistant. I am connected to our live database to provide you with the most accurate hotel and booking information. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session-${Math.random().toString(36).substr(2, 9)}`);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await sendChatMessage(input, sessionId, token);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        sources: data.sources,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your connection and try again in a moment. If you're looking for personal bookings, make sure you're logged in.",
        isError: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "List hotels in Jerusalem",
    "Show my personal bookings",
    "What is the cancellation policy?",
    "Calculate stay price for White Arena"
  ];

  return (
    <div className="elite-ai-widget-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000, fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          style={{
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <MessageSquare size={28} />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, scale: 1, y: 0,
              height: isMinimized ? '64px' : '500px', width: '380px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              maxHeight: 'calc(100vh - 100px)', maxWidth: 'calc(100vw - 48px)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px', background: '#0f172a', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot size={20} className="text-blue-400" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>Elite AI Assistant</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
                    <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '10px' }}>Live Data Active</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setIsMinimized(!isMinimized)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#f8fafc' }}>
                  {messages.map((msg) => (
                    <div key={msg.id} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                      <div style={{
                        padding: '12px 16px', borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        background: msg.role === 'user' ? '#1e293b' : 'white',
                        color: msg.role === 'user' ? 'white' : '#1e293b',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                        fontSize: '14px', lineHeight: '1.5'
                      }}>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                        {msg.sources && (
                          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', fontSize: '10px', color: '#94a3b8' }}>
                            <CheckCircle2 size={10} style={{ display: 'inline', marginRight: '4px' }} />
                            Source: {msg.sources.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && <Loader2 size={16} className="animate-spin text-slate-400" style={{ margin: '10px' }} />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
                  {messages.length === 1 && (
                    <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => setInput(s)} style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '11px', cursor: 'pointer' }}>{s}</button>
                      ))}
                    </div>
                  )}
                  <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                    <input
                      value={input} onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask for real-time hotels or bookings..."
                      style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }}
                    />
                    <button type="submit" style={{ padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiChatWidget;