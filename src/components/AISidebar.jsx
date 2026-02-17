import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, Send, X, MessageSquare, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AISidebar({ extractedText, isOpen, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (customPrompt = null) => {
        const textToSend = customPrompt || input;
        if (!textToSend.trim() || !genAI) return;

        const userMessage = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const context = `Context from current study slide: "${extractedText}"\n\nUser question: ${textToSend}`;

            const result = await model.generateContent(context);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'ai', content: text }]);
        } catch (error) {
            console.error("Gemini Error:", error);
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please check your API key." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { label: 'Explain this slide', icon: <Sparkles size={16} />, prompt: 'Explain the main concepts on this slide simply.' },
        { label: 'Simplify language', icon: <Zap size={16} />, prompt: 'Rewrite the content of this slide using very simple language.' },
        { label: 'Key takeaways', icon: <ShieldCheck size={16} />, prompt: 'What are the top 3 key takeaways from this slide?' },
    ];

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="ai-sidebar"
        >
            <div className="ai-sidebar-header">
                <div className="flex items-center gap-2">
                    <MessageSquare className="text-indigo-400" size={20} />
                    <h3 className="font-bold">AI Assistant</h3>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="ai-sidebar-content">
                {!apiKey && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-4">
                        <p className="text-xs text-rose-300">
                            Gemini API Key missing. Please add it to your .env file to use the AI.
                        </p>
                    </div>
                )}

                <div className="messages-container">
                    {messages.length === 0 && (
                        <div className="text-center py-8 opacity-40">
                            <Sparkles size={40} className="mx-auto mb-2" />
                            <p className="text-sm">Ask me anything about this slide!</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.role}`}>
                            <div className="message-bubble">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message ai">
                            <div className="message-bubble loading">
                                <RefreshCw className="animate-spin" size={16} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="quick-actions">
                    {quickActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(action.prompt)}
                            className="quick-action-btn"
                            disabled={isLoading || !apiKey}
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="ai-sidebar-footer">
                <div className="input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a question..."
                        disabled={isLoading || !apiKey}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !apiKey || !input.trim()}
                        className="send-btn"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
