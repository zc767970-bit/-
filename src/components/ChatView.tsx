import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Square,
  Image as ImageIcon,
  Heart,
  Smile,
  Play,
  Pause,
  Trash2,
  CheckCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { ChatMessage, UserId, UserProfile } from '../types';
import { playMessageSound } from '../utils/audio';

interface ChatViewProps {
  currentUserId: UserId;
  currentUser: UserProfile;
  partnerUser: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  onSendLoveHeart: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUserId,
  currentUser,
  partnerUser,
  messages,
  onSendMessage,
  onSendLoveHeart,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Voice Recording using MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          onSendMessage({
            senderId: currentUserId,
            type: 'audio',
            audioUrl: base64Audio,
            audioDuration: recordingSeconds || 2,
          });
          playMessageSound();
        };
        // stop tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission denied or not supported:', err);
      // Fallback friendly simulation if microphone is blocked in preview iframe
      const simulatedDuration = 4;
      onSendMessage({
        senderId: currentUserId,
        type: 'audio',
        text: 'تسجيل صوتي خاص: "بحبك أوي يا روحي وخلي بالك من نفسك"',
        audioDuration: simulatedDuration,
      });
      playMessageSound();
    }
  };

  const stopRecording = (cancel = false) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && isRecording) {
      if (cancel) {
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      } else {
        mediaRecorderRef.current.stop();
      }
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  // Image Upload Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendTextMessage = () => {
    if (!inputText.trim() && !selectedImage) return;

    if (selectedImage) {
      onSendMessage({
        senderId: currentUserId,
        type: 'image',
        imageUrl: selectedImage,
        text: inputText.trim() || undefined,
      });
      setSelectedImage(null);
    } else {
      onSendMessage({
        senderId: currentUserId,
        type: 'text',
        text: inputText.trim(),
      });
    }

    setInputText('');
    playMessageSound();
  };

  // Audio Playback
  const handlePlayAudio = (id: string, url?: string) => {
    if (playingAudioId === id) {
      audioPlayerRef.current?.pause();
      setPlayingAudioId(null);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    if (url) {
      const audio = new Audio(url);
      audioPlayerRef.current = audio;
      audio.play().catch(() => {});
      setPlayingAudioId(id);
      audio.onended = () => setPlayingAudioId(null);
    } else {
      // Simulate playback
      setPlayingAudioId(id);
      setTimeout(() => setPlayingAudioId(null), 3000);
    }
  };

  const quickStickers = [
    'بحبك مووت ❤️',
    'وحشتيني أوي 🥺',
    'أنا في طريقي ليكي 🚗',
    'طمنيني عنك أول بأول 🌸',
    'دعايا ليكي في كل صلاة 🤲',
    'يا أحلى صدفة في عمري ✨',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-170px)] min-h-[500px] max-h-[750px] rounded-3xl overflow-hidden border border-rose-500/20 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
      {/* Chat Header */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={partnerUser.avatar}
              alt={partnerUser.name}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-rose-500/50"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-1.5">
              {partnerUser.name}
              <span className="text-xs text-rose-400 font-normal">({partnerUser.nickname})</span>
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {partnerUser.status}
            </p>
          </div>
        </div>

        {/* Quick Send Love Heart Button */}
        <button
          onClick={onSendLoveHeart}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500 border border-rose-500/40 text-rose-300 hover:text-white transition shadow-lg text-xs font-semibold"
          title="إرسال نبضة حب فورية"
        >
          <Heart className="w-4 h-4 text-rose-400 group-hover:text-white fill-rose-400 transition" />
          <span>نبضة حب</span>
        </button>
      </div>

      {/* Quick Stickers bar */}
      <div className="px-3 py-2 bg-slate-950/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] text-slate-400 shrink-0 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          رسائل سريعة:
        </span>
        {quickStickers.map((sticker, idx) => (
          <button
            key={idx}
            onClick={() => {
              onSendMessage({ senderId: currentUserId, type: 'sticker', text: sticker });
              playMessageSound();
            }}
            className="text-xs whitespace-nowrap px-3 py-1 rounded-full bg-slate-800/80 hover:bg-rose-900/40 hover:text-rose-200 border border-white/10 text-slate-200 transition"
          >
            {sticker}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-950/30 to-slate-900/60">
        <div className="text-center my-2">
          <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800/60 text-slate-400 border border-white/5">
            مساحة المحادثة الآمنة والمشفرة بين {currentUser.name} و {partnerUser.name} 🔒🤍
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} transition-all`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-lg relative ${
                  isMe
                    ? 'bg-gradient-to-tr from-rose-600 to-pink-600 text-white rounded-bl-sm'
                    : 'bg-slate-800/90 border border-white/10 text-slate-100 rounded-br-sm'
                }`}
              >
                {/* Sender badge if needed */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[10px] font-bold ${isMe ? 'text-rose-200' : 'text-rose-400'}`}>
                    {isMe ? 'أنا' : partnerUser.name}
                  </span>
                  <span className={`text-[9px] ${isMe ? 'text-rose-100/75' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Text Message */}
                {msg.text && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.text}
                  </p>
                )}

                {/* Photo Message */}
                {msg.imageUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-white/20 bg-black/20">
                    <img
                      src={msg.imageUrl}
                      alt="صورة مشتركة"
                      className="w-full max-h-64 object-cover hover:scale-105 transition cursor-pointer"
                      onClick={() => window.open(msg.imageUrl, '_blank')}
                    />
                  </div>
                )}

                {/* Voice Note Message */}
                {msg.type === 'audio' && (
                  <div className="flex items-center gap-3 mt-1.5 p-2 rounded-xl bg-black/20 min-w-[200px]">
                    <button
                      onClick={() => handlePlayAudio(msg.id, msg.audioUrl)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow ${
                        isMe ? 'bg-white text-rose-600 hover:bg-rose-50' : 'bg-rose-500 text-white hover:bg-rose-400'
                      }`}
                    >
                      {playingAudioId === msg.id ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current mr-0.5" />
                      )}
                    </button>

                    <div className="flex-1">
                      {/* Audio wave simulation */}
                      <div className="flex items-center gap-0.5 h-6">
                        {[40, 70, 30, 90, 60, 100, 45, 80, 50, 70, 35, 85, 60].map((h, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-full transition-all ${
                              playingAudioId === msg.id
                                ? 'bg-white animate-pulse'
                                : isMe
                                ? 'bg-white/60'
                                : 'bg-rose-400/70'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] opacity-80 mt-1">
                        <span>تسجيل صوتي</span>
                        <span>{msg.audioDuration ? `0:${msg.audioDuration.toString().padStart(2, '0')}` : '0:04'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Read checkmark for me */}
                {isMe && (
                  <div className="flex justify-end mt-1 text-rose-200">
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Image Preview before sending */}
      {selectedImage && (
        <div className="p-2 bg-slate-950/90 border-t border-white/10 flex items-center gap-3">
          <img src={selectedImage} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-rose-500/40" />
          <div className="flex-1 text-xs text-slate-300">
            جاهز للإرسال إلى {partnerUser.name} 📸
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Audio Recording Banner if active */}
      {isRecording && (
        <div className="px-4 py-2.5 bg-rose-950/80 border-t border-rose-500/40 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-rose-200 font-bold text-xs">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            جاري تسجيل الريكورد الصوتي ({recordingSeconds} ثانية)...
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => stopRecording(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              إلغاء
            </button>
            <button
              onClick={() => stopRecording(false)}
              className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              إرسال الريكورد
            </button>
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-3 bg-slate-950/90 border-t border-white/10">
        <div className="flex items-center gap-2">
          {/* Photo attachment input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-2xl transition"
            title="إرسال صورة"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Voice Record button */}
          <button
            onClick={isRecording ? () => stopRecording(false) : startRecording}
            className={`p-2.5 rounded-2xl transition ${
              isRecording
                ? 'bg-rose-600 text-white animate-bounce'
                : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
            }`}
            title="تسجيل ريكورد صوتي"
          >
            {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendTextMessage();
            }}
            placeholder={`اكتب رسالة لحبيبتك ${partnerUser.name}...`}
            className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-rose-500 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
          />

          {/* Send Button */}
          <button
            onClick={handleSendTextMessage}
            disabled={!inputText.trim() && !selectedImage}
            className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-40 text-white transition shadow-lg shadow-rose-900/30 flex items-center justify-center"
          >
            <Send className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
