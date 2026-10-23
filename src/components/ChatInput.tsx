import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RotateCcw } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onResetChat: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onResetChat
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-3 sm:p-4 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-end gap-2 sm:gap-3">
        {/* Reset button */}
        <button
          type="button"
          onClick={onResetChat}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-[#11284f] hover:border-slate-300 hover:bg-slate-50 transition-colors flex-shrink-0"
          title="Reiniciar conversación"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Input area */}
        <div className="flex-1 relative bg-slate-50 rounded-2xl border border-slate-300 focus-within:border-[#11284f] focus-within:ring-2 focus-within:ring-[#11284f]/10 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregunta sobre aranceles, carreras o admisiones..."
            disabled={isLoading}
            className="w-full resize-none bg-transparent px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none max-h-32 min-h-[42px]"
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!input.trim() || isLoading}
          className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all flex-shrink-0 cursor-pointer ${
            input.trim() && !isLoading
              ? 'bg-[#11284f] hover:bg-[#1a3c75] text-[#ffc606] shadow-md hover:shadow-lg active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-[#ffc606] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline font-semibold">Enviar</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-1.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>Presiona <strong>Enter</strong> para enviar. <strong>Shift + Enter</strong> para salto de línea.</span>
        <span className="hidden sm:flex items-center gap-1 text-[#11284f] font-medium">
          <Sparkles className="w-3 h-3 text-[#ffc606]" />
          Respuestas institucionales oficiales
        </span>
      </div>
    </div>
  );
};
