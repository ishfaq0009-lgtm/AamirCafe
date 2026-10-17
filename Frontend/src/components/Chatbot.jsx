import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  MessageSquare,
  X,
  Send,
  User,
  Bot,
  Loader2,
  Trash2,
  Sparkles,
} from 'lucide-react'
import { sendChatMessage } from '../api/chat.js'

const INITIAL_MESSAGE = {
  role: 'model',
  text: 'Hello! I am the Aamir Cafe assistant. How can I help you today? (I can answer questions about our menu, hall bookings, deals, and more!)',
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    const newMessages = [...messages, { role: 'user', text: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      // Exclude initial greeting from history to save tokens
      const history = newMessages.slice(1, -1)
      const res = await sendChatMessage(userMessage, history)

      if (res.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: res.reply },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: 'Sorry, I am having trouble connecting right now. Please try again.' },
        ])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Sorry, I am having trouble connecting right now. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    if (loading) return
    setMessages([INITIAL_MESSAGE])
    setInput('')
  }

  return (
    <>
      {/* ⭐ Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] shadow-[0_8px_30px_rgba(245,166,35,0.5)]"
            aria-label="Open Chat"
          >
            <MessageSquare className="h-7 w-7" />
            {/* Notification Dot */}
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C0392B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#C0392B] border-2 border-[#FFF8E7]"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ⭐ Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
            className="fixed bottom-6 right-6 z-50 flex h-[550px] w-[90vw] sm:w-[400px] flex-col overflow-hidden rounded-3xl border border-[#F5A623]/30 bg-[#FFFDF7] shadow-[0_20px_60px_rgba(107,76,42,0.15)]"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between overflow-hidden bg-[#1A1A1A] px-5 py-4">
              {/* Subtle background glow */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#F5A623]/20 blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5A623] to-[#E8941A] shadow-[0_0_15px_rgba(245,166,35,0.4)]">
                  <Bot className="h-5 w-5 text-[#1A1A1A]" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1A1A1A] bg-green-500"></span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold tracking-wide text-[#FFF8E7]">
                    Aamir Assistant
                  </h3>
                  <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#F5A623]">
                    <Sparkles className="h-3 w-3" /> AI Powered
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={clearChat}
                  disabled={loading || messages.length === 1}
                  className="group flex h-8 w-8 items-center justify-center rounded-full text-[#FFF8E7]/50 transition hover:bg-white/10 hover:text-[#F5A623] disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Clear Chat"
                >
                  <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#FFF8E7]/50 transition hover:bg-white/10 hover:text-white"
                  title="Close Chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FFF8E7]/50 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#C0392B] text-white'
                        : 'bg-[#F5A623]/20 text-[#C0392B]'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#1A1A1A] text-[#FFF8E7] rounded-tr-sm'
                        : 'bg-white text-[#1A1A1A] border border-[#F5A623]/20 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 flex-row"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5A623]/20 text-[#C0392B]">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm border border-[#F5A623]/20 flex items-center gap-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="h-1.5 w-1.5 rounded-full bg-[#C0392B]"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="h-1.5 w-1.5 rounded-full bg-[#C0392B]"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="h-1.5 w-1.5 rounded-full bg-[#C0392B]"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-[#F5A623]/20 bg-white p-4">
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 rounded-full border border-[#F5A623]/30 bg-[#FFFDF7] px-2 py-1.5 shadow-inner transition focus-within:border-[#F5A623] focus-within:ring-2 focus-within:ring-[#F5A623]/20"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about our menu, hall, deals..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-[#1A1A1A] outline-none placeholder:text-[#6B4C2A]/40"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] transition hover:scale-105 hover:shadow-[0_4px_15px_rgba(245,166,35,0.4)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-[#6B4C2A]/50">
                Powered by Gemini AI · Amir Cafe
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot