import { useEffect, useRef, useState } from 'react';
import { Send, Mic, MicOff, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const { supported, listening, transcript, interimTranscript, error, start, stop, reset } =
    useSpeechRecognition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync recognized transcript into the text field.
  useEffect(() => {
    if (transcript) {
      setText((prev) => {
        // Only append if the new transcript isn't already at the end.
        if (prev.endsWith(transcript)) return prev;
        return (prev + ' ' + transcript).trim();
      });
      reset();
    }
  }, [transcript, reset]);

  // Auto-grow textarea.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicToggle = () => {
    if (listening) {
      stop();
    } else {
      start();
    }
  };

  return (
    <div className="border-t border-emerald-900/10 bg-cream-50/90 px-4 py-4 backdrop-blur-md dark:border-gold-400/15 dark:bg-ink-900/90">
      <div className="mx-auto max-w-3xl">
        {error && (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}

        <div
          className={`flex items-end gap-2 rounded-2xl border bg-white/80 p-2 shadow-soft transition-all dark:bg-ink-800/80 ${
            listening
              ? 'border-emerald-600 ring-2 ring-emerald-600/20 dark:border-gold-400 dark:ring-gold-400/20'
              : 'border-emerald-900/15 dark:border-gold-400/15'
          }`}
        >
          {/* Mic button / waveform */}
          <div className="flex shrink-0 items-center gap-1.5">
            {listening ? (
              <div className="flex items-end gap-[3px] px-1.5 py-2" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="wave-bar block w-[3px] rounded-full bg-emerald-600 dark:bg-gold-300"
                    style={{ height: '20px' }}
                  />
                ))}
              </div>
            ) : null}
            <button
              onClick={handleMicToggle}
              disabled={!supported}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                !supported
                  ? 'cursor-not-allowed bg-ink-100 text-ink-300 dark:bg-ink-700 dark:text-ink-500'
                  : listening
                    ? 'bg-emerald-600 text-white shadow-glow dark:bg-gold-400 dark:text-ink-900'
                    : 'bg-emerald-900/8 text-emerald-800 hover:bg-emerald-700/15 dark:bg-gold-400/10 dark:text-gold-300 dark:hover:bg-gold-400/20'
              }`}
              aria-label={listening ? 'Stop recording' : 'Start voice input'}
              title={
                supported
                  ? listening
                    ? 'Stop recording'
                    : 'Speak your message'
                  : 'Voice input not supported in this browser'
              }
            >
              {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          </div>

          {/* Text area */}
          <textarea
            ref={textareaRef}
            value={text + (interimTranscript ? ' ' + interimTranscript : '')}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={
              listening ? 'Listening… speak from the heart' : 'Share what is on your mind…'
            }
            className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-emerald-900 placeholder:text-emerald-900/40 focus:outline-none dark:text-cream-50 dark:placeholder:text-ink-400"
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-700 text-cream-50 shadow-soft transition-all hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:from-ink-200 disabled:to-ink-200 disabled:text-ink-400 dark:disabled:from-ink-700 dark:disabled:to-ink-700 dark:disabled:text-ink-500"
            aria-label="Send message"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>

        <p className="mt-2 text-center text-[10px] text-emerald-900/40 dark:text-ink-400">
          Iman offers reflective support, not formal religious rulings.
        </p>
      </div>
    </div>
  );
}
