import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, PhoneCall, Heart, PartyPopper, Smile, X } from 'lucide-react';
import { GoodNewsAlert, UserProfile } from '../types';
import { playGoodNewsChime } from '../utils/audio';

interface GoodNewsModalProps {
  alert: GoodNewsAlert;
  senderProfile: UserProfile;
  onDismiss: () => void;
  onCall: () => void;
}

export const GoodNewsModal: React.FC<GoodNewsModalProps> = ({
  alert,
  senderProfile,
  onDismiss,
  onCall,
}) => {
  useEffect(() => {
    playGoodNewsChime();
    // Confetti celebration
    confetti({
      particleCount: 130,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f43f5e', '#a855f7', '#34d399', '#38bdf8'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-amber-950/90 via-slate-900 to-rose-950/90 border-2 border-amber-400 p-6 sm:p-8 shadow-2xl shadow-amber-500/30 text-center space-y-5 animate-in zoom-in-95 duration-300">
        <button
          onClick={onDismiss}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Badge */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/40 animate-bounce">
          🎉
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            بشرى خير ورنة الفرحة!
          </span>
          <h2 className="text-2xl font-black text-white">
            حاجة حلوة أوي حصلت مع {senderProfile.name}! 🥳
          </h2>
          <p className="text-sm text-amber-200">
            {alert.title || 'فرحة كبيرة وحاجة مبهجة حصلت دلوقتي!'}
          </p>
        </div>

        {/* Note / Message */}
        {alert.message && (
          <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/30 text-sm text-slate-200 leading-relaxed font-medium">
            "{alert.message}"
          </div>
        )}

        <p className="text-xs text-rose-300 font-semibold flex items-center justify-center gap-1">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
          رن عليه حالاً عشان تباركله وتسمع حكايته الحلوة!
        </p>

        {/* Direct Call Button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onCall}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base transition shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-5 h-5 fill-current" />
            اتصال بـ {senderProfile.name} الآن 📞
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            شكراً، هكلمه فوراً 🤍
          </button>
        </div>
      </div>
    </div>
  );
};
