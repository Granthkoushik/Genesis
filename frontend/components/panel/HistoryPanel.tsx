"use client";

import { motion } from "framer-motion";
import { useAIStore } from "@/stores/useAIStore";
import { MessageSquare, Bot, User, Trash2 } from "lucide-react";

export function HistoryPanel() {
  const { conversation, clearConversation } = useAIStore();

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the conversation history?")) {
      clearConversation();
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="section-label">Conversation Log</div>
        {conversation.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-[10px] text-white/30 hover:text-red-400 transition-colors"
          >
            <Trash2 size={11} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {conversation.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 h-48">
          <MessageSquare className="text-white/10" size={24} />
          <div className="text-white/20 text-xs text-center leading-relaxed">
            No history yet.<br />Engage the Reality Engine to begin.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-1">
          {conversation.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
              className={`p-3 rounded-lg border flex flex-col gap-1.5 ${
                msg.role === "user"
                  ? "bg-white/[0.03] border-white/[0.06]"
                  : "bg-neon-blue/[0.04] border-neon-blue/15"
              }`}
            >
              {/* Role badge */}
              <div className="flex items-center gap-1.5 justify-between">
                <div className="flex items-center gap-1">
                  {msg.role === "user" ? (
                    <>
                      <User size={10} className="text-white/40" />
                      <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">
                        Creator
                      </span>
                    </>
                  ) : (
                    <>
                      <Bot size={10} className="text-neon-cyan" />
                      <span className="text-[9px] font-semibold text-neon-cyan uppercase tracking-wider">
                        Genesis AI
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[8px] text-white/20">
                  {formatDate(msg.timestamp)}
                </span>
              </div>

              {/* Message content */}
              <div
                className={`text-[11px] leading-relaxed font-sans ${
                  msg.role === "user" ? "text-white/70" : "text-white/95"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
