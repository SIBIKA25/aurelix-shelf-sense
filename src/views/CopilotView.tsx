import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Lightbulb,
  ArrowRight,
  PackagePlus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Product, ChatMessage } from '../types';
import { generateCopilotAnswer } from '../utils/analysisEngine';

interface CopilotViewProps {
  products: Product[];
  onOpenRestock: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  products,
  onOpenRestock,
  onSelectProduct
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'copilot',
      timestamp: 'Just now',
      text: `Hello Rajesh! I am your RetailIQ Sales & Inventory Copilot. 

I've analyzed today's register receipts and stock room levels for Store #104. How can I assist your operational decisions today?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions specified in prompt
  const suggestedQuestions = [
    'Which products should I restock?',
    'What is my best-selling product?',
    'Which products are low in stock?',
    'Which products are overstocked?',
    'What should I focus on today?',
    'How can I improve inventory?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessageId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMessageId,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: query
      }
    ];

    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI reasoning and response based on active inventory data
    setTimeout(() => {
      const copilotResponse = generateCopilotAnswer(query, products);
      setMessages([
        ...newMessages,
        {
          ...copilotResponse,
          id: `copilot-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleCreateRestockFromChat = (productId?: string) => {
    const targetProduct =
      products.find((p) => p.id === productId) ||
      products.find((p) => p.name.toLowerCase().includes('oil')) ||
      products[0];
    onOpenRestock(targetProduct);
  };

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-8rem)]">
      {/* Page Title & Daily Business Insight Required by Prompt */}
      <div className="space-y-3 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">RetailIQ Copilot</h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 opacity-80">
              Intelligent decision assistant powered by real-time store inventory and checkout analytics.
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full status-normal font-semibold self-start sm:self-auto">
            Live Copilot Engine Ready
          </span>
        </div>

        {/* Top Daily Business Insight Banner Required by Prompt */}
        <div className="p-4 rounded-2xl glass border border-teal-500/30 backdrop-blur-xl shadow-lg flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex-shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5 text-amber-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Today's Business Insight
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Morning Shift Brief</span>
            </div>
            <p className="text-sm font-medium text-slate-100 mt-1 leading-relaxed">
              "Your highest priority is <strong className="text-red-400">Cooking Oil</strong>. It has strong sales but critically low inventory (only 5 units left). Restocking it can prevent lost sales."
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 min-h-0 glass border border-white/10 rounded-2xl shadow-xl flex flex-col overflow-hidden backdrop-blur-xl">
        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm ${
                    isUser
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-white/10 border border-white/15 text-teal-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-xs shadow-md shadow-teal-500/20'
                      : 'glass border border-white/10 text-slate-200 rounded-tl-xs shadow-md backdrop-blur-md'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed font-sans">
                    {msg.text}
                  </div>

                  {/* Structured Recommendation Action Cards inside Copilot Chat */}
                  {msg.structuredData?.recommendations && (
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                        Actionable Replenishment Cards:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {msg.structuredData.recommendations.map((item) => (
                          <div
                            key={item.productId}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white truncate">{item.productName}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                  item.priority === 'URGENT'
                                    ? 'status-urgent'
                                    : item.priority === 'HIGH'
                                    ? 'status-warning'
                                    : 'status-normal'
                                }`}
                              >
                                {item.priority}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Stock: <strong className="text-white font-mono">{item.stock}</strong> | Sold: <span className="font-mono">{item.unitsSold}</span>
                            </p>
                            <button
                              onClick={() => handleCreateRestockFromChat(item.productId)}
                              className="w-full mt-1 py-1 px-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <PackagePlus className="w-3 h-3" />
                              <span>Restock</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Single CTA if specified */}
                  {!msg.structuredData?.recommendations && msg.structuredData?.actionableProductId && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-end">
                      <button
                        onClick={() => handleCreateRestockFromChat(msg.structuredData?.actionableProductId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        <PackagePlus className="w-3.5 h-3.5" />
                        <span>Create Restock Request</span>
                      </button>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-2 ${
                      isUser ? 'text-slate-800 font-semibold text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-md">
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 text-teal-300 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl glass border border-white/10 text-slate-300 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-300 ml-1">Analyzing store inventory ledger...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Question Chips Required by Prompt */}
        <div className="p-3 bg-white/[0.03] border-t border-white/10 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-teal-300 flex items-center gap-1 whitespace-nowrap pl-1">
            <Sparkles className="w-3 h-3 text-teal-400" />
            Suggested:
          </span>
          <div className="flex items-center gap-1.5">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl glass hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-all cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white/[0.04] border-t border-white/10 flex items-center gap-2 backdrop-blur-md">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder="Ask Copilot (e.g., 'Which products should I restock today?')..."
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:bg-white/5 disabled:text-slate-500 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
