import React, { useRef, useEffect, useState } from 'react';
import { Message, GroundingChunk } from '../types';
import { Send, Cpu, Bot, User, ExternalLink, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide pb-28">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
            <div className="bg-white p-6 rounded-full shadow-soft mb-6">
                <Bot size={48} className="text-brand-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600">Your Personal Career AI</h3>
            <p className="text-sm mt-2 max-w-md text-center">Ask me anything about your salary, role transition, or future career path.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-5 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-sm shadow-brand-500/20'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-card'
              }`}
            >
              <div className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider pb-2 border-b ${
                  msg.role === 'user' ? 'border-brand-500/50 text-brand-100' : 'border-slate-100 text-slate-400'
              }`}>
                {msg.role === 'user' ? (
                    <>
                        <User size={12} /> YOU
                    </>
                ) : (
                    <>
                        <BrainCircuit size={14} className="text-brand-500" /> AI ADVISOR
                    </>
                )}
              </div>
              
              <div className={`prose prose-sm max-w-none leading-relaxed ${
                  msg.role === 'user' 
                  ? 'prose-invert prose-p:text-brand-50' 
                  : 'prose-slate prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-slate-900 prose-strong:font-bold'
              }`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {/* Grounding Citations */}
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ExternalLink size={10} /> Sources & Trends:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingSources.map((source, idx) => (
                      source.web?.uri ? (
                        <a
                            key={idx}
                            href={source.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-slate-50 hover:bg-slate-100 text-brand-600 px-2.5 py-1.5 rounded border border-slate-200 transition-colors truncate max-w-[200px] flex items-center gap-1.5"
                            title={source.web.title}
                        >   
                            <div className="w-1 h-1 rounded-full bg-green-500"></div>
                            <span className="truncate">{source.web.title || new URL(source.web.uri).hostname}</span>
                        </a>
                      ) : null
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start w-full animate-in fade-in duration-300">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-5 shadow-card flex items-center gap-4 max-w-md">
              <div className="relative flex items-center justify-center w-10 h-10 bg-brand-50 rounded-lg">
                <Cpu size={20} className="text-brand-600 animate-pulse" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping border border-white"></div>
              </div>
              <div className="space-y-1.5">
                <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    Analyzing Career Data <Sparkles size={12} className="text-amber-500" />
                </div>
                <div className="text-xs text-slate-500 animate-pulse">
                    Cross-referencing global salary benchmarks...
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Floating & Clean */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <div className="relative max-w-4xl mx-auto flex items-end gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl shadow-slate-200/50 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about salary trends, skills, or your next career move..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 text-slate-800 placeholder:text-slate-400 py-3 px-3 text-sm md:text-base"
            rows={1}
            style={{ minHeight: '52px' }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-xl flex-shrink-0 mb-1 transition-all duration-200 ${
              isLoading || !input.trim()
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/20 transform active:scale-95'
            }`}
          >
             {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-[10px] md:text-xs text-slate-400 mt-3 font-medium flex justify-center items-center gap-1.5">
            <Sparkles size={10} /> Powered by Gemini 3 Pro • 32k Thinking Budget • Real-time Market Data
        </p>
      </div>
    </div>
  );
};