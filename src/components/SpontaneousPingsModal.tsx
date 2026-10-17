import React, { useState } from 'react';
import {
  BellRing,
  Heart,
  Sparkles,
  Coffee,
  Smile,
  Clock,
  Send,
  X,
  Shuffle,
  Check,
} from 'lucide-react';
import { UserId, UserProfile } from '../types';
import { SPONTANEOUS_PINGS_SUGGESTIONS } from '../utils/storage';
import { playLovePingSound } from '../utils/audio';

interface SpontaneousPingsModalProps {
  currentUserId: UserId;
  currentUser: UserProfile;
  partnerUser: UserProfile;
  onSendPing: (title: string, message: string, type: 'love_ping' | 'water' | 'smile' | 'hug' | 'mystery_alarm') => void;
  onScheduleRandomAlarm: (minutes: number, note: string) => void;
  onClose: () => void;
}

export const SpontaneousPingsModal: React.FC<SpontaneousPingsModalProps> = ({
  currentUserId,
  currentUser,
  partnerUser,
  onSendPing,
  onScheduleRandomAlarm,
  onClose,
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [randomMinutes, setRandomMinutes] = useState(25);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const handleSendPreset = (preset: typeof SPONTANEOUS_PINGS_SUGGESTIONS[0]) => {
    onSendPing(preset.title, preset.message, preset.type);
    playLovePingSound();
    onClose();
  };

  const handleSendCustom = () => {
    if (!customTitle.trim()) return;
    onSendPing(
      customTitle.trim(),
      customMessage.trim() || 'تنبيه حب عفوي ومفاجئ من حبيبك!',
      'love_ping'
    );
    playLovePingSound();
    onClose();
  };

  const handleSchedule = () => {
    onScheduleRandomAlarm(randomMinutes, customTitle || 'منبه الحب المفاجئ ⏰💖');
    setScheduledSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-rose-500/30 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-right space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
            <BellRing className="w-3.5 h-3.5 text-rose-400" />
            منبه وإشعارات بمواعيد غير محددة (عفوية)
          </div>
          <h3 className="text-xl font-bold text-white">
            فاجئ {partnerUser.name} برنة وتنبيه حب في أي وقت! ✨
          </h3>
          <p className="text-xs text-slate-300">
            اختار تنبيه فوري أو جدول منبه عشوائي غير متوقع يرن في نص اليوم ويفرح قلبها.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            إشعارات سريعة جاهزة للإرسال فوراً:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SPONTANEOUS_PINGS_SUGGESTIONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPreset(preset)}
                className="p-3 rounded-2xl bg-slate-800/80 hover:bg-rose-950/40 hover:border-rose-500/40 border border-white/5 text-right transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 group-hover:scale-110 transition">
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  </span>
                  <span className="font-bold text-white text-xs group-hover:text-rose-200">
                    {preset.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{preset.message}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Instant Ping */}
        <div className="p-4 rounded-2xl bg-slate-850/70 border border-white/10 space-y-3">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            أو اكتب إشعار ومنبه مخصص من قلبك:
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="عنوان التنبيه (مثال: وحشتيني فجأة، جهزي نفسك للخروج...)"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
          />
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="الرسالة التفصيلية اللي هتظهر في التنبيه..."
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {/* Random schedule picker */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>وقت عشوائي:</span>
              <select
                value={randomMinutes}
                onChange={(e) => setRandomMinutes(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
              >
                <option value={15}>بعد 15 دقيقة</option>
                <option value={30}>بعد نصف ساعة</option>
                <option value={60}>بعد ساعة واحدة</option>
                <option value={120}>بعد ساعتين (مفاجأة)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSchedule}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10"
              >
                جدولة عفوية ⏰
              </button>
              <button
                onClick={handleSendCustom}
                disabled={!customTitle.trim()}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                إرسال فوراً
              </button>
            </div>
          </div>

          {scheduledSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              تم جدولة المنبه العفوي بنجاح! هيرن عند {partnerUser.name} في الموعد المحدد.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
