"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ChatbotWidget: React.FC = () => {
  const [showOink, setShowOink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowOink(true);
      setTimeout(() => setShowOink(false), 1500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* External interactive widget isolated in iframe */}
      <iframe
        src="/semayot/noupe-widget.html"
        title="Chatbot"
        className="fixed bottom-6 right-6 z-[9996] w-72 h-80 pointer-events-auto"
        style={{ border: "none", overflow: "hidden", background: "transparent" }}
        loading="lazy"
        scrolling="no"
        frameBorder={0}
      />

      {/* Comic "oink oink" effect — positioned above widget */}
      <div className="fixed bottom-[100px] right-4 z-[9998] pointer-events-none">
        <AnimatePresence>
          {showOink && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: -10 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#E7E5E4]">
                  <span className="text-sm font-black text-[#FF4F79] font-display italic whitespace-nowrap">
                    Oink! 🐷
                  </span>
                </div>
                <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white border-r border-b border-[#E7E5E4] transform rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
export default ChatbotWidget;
