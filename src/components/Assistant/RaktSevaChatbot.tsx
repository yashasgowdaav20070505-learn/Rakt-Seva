import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  X, 
  Bot, 
  User, 
  Loader2, 
  ExternalLink,
  ChevronDown,
  Droplet,
  Compass
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; uri: string }[];
}

export const RaktSevaChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Namaste! I am RaktSeva Mitra, your 24/7 clinical blood donation and transfusion assistant. How can I help you today? You can ask about eligibility rules, cooling-off periods, blood components, or preparation tips.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: text }
    ];

    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Check if user specifically asked for locations or web search
      if (text.toLowerCase().includes('find') || text.toLowerCase().includes('where') || text.toLowerCase().includes('center')) {
        const groundedRes = await api.groundedSearch(text);
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: groundedRes.answer || "Here is what I found for your query.",
            sources: groundedRes.sources
          }
        ]);
      } else {
        const reply = await api.chatWithGemini(
          newMessages.map(m => ({ role: m.role, content: m.content }))
        );
        setMessages([
          ...newMessages,
          { role: 'assistant', content: reply }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I apologize, I am temporarily having trouble reaching the knowledge base. Please check back in a moment or refer to our Educational Repository tab!'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'How long must I wait after getting a tattoo?',
    'Why do platelets expire in only 5 days?',
    'What foods boost hemoglobin before donating?',
    'What is the cooling-off period between donations?'
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-4 shadow-xl flex items-center gap-2.5 transition-transform hover:scale-105"
          aria-label="Open RaktSeva AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
          </div>
          <span className="text-xs font-bold hidden sm:inline">Ask RaktSeva Mitra</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <span>RaktSeva Mitra (रक्तसेवा मित्र)</span>
                  <span className="text-[10px] font-semibold bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">
                    AI Clinical
                  </span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Grounded in NBTC Clinical Guidelines
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-rose-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs whitespace-pre-line'
                  }`}
                >
                  {msg.content}

                  {/* Grounded Web Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Compass className="w-3 h-3 text-rose-600" />
                        <span>Referenced Web Resources:</span>
                      </div>
                      {msg.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-rose-700 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{src.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center text-slate-500 text-xs">
                <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-xs flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                  <span>RaktSeva Mitra is analyzing medical guidelines...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          {messages.length <= 2 && (
            <div className="p-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1.5 shrink-0">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  className="text-[11px] bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask about donation eligibility, cooling-off, or blood banks..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white p-2 rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
