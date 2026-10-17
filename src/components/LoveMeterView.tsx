import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  Gift,
  Lock,
  Unlock,
  Smile,
  Coffee,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Flame,
  Award,
  Mail,
  Copy,
  Check,
  Feather,
  BookOpen,
} from 'lucide-react';
import { MysteryBoxReward, UserId, UserProfile } from '../types';
import { playBoxOpenSound, playLovePingSound } from '../utils/audio';

interface LoveMeterViewProps {
  currentUserId: UserId;
  currentUser: UserProfile;
  partnerUser: UserProfile;
  loveMeter: number;
  onIncreaseLoveMeter: (amount: number, reason: string) => void;
  onResetLoveMeter: () => void;
  mysteryRewards: MysteryBoxReward[];
  onAddCustomReward: (reward: MysteryBoxReward) => void;
}

export const LoveMeterView: React.FC<LoveMeterViewProps> = ({
  currentUserId,
  currentUser,
  partnerUser,
  loveMeter,
  onIncreaseLoveMeter,
  onResetLoveMeter,
  mysteryRewards,
  onAddCustomReward,
}) => {
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [revealedReward, setRevealedReward] = useState<MysteryBoxReward | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [viewingAllLetters, setViewingAllLetters] = useState(false);

  const isUnlocked = loveMeter >= 100;

  const handlePickBox = (boxIndex: number) => {
    if (!isUnlocked) return;
    if (selectedBoxIndex !== null) return; // already picked

    setSelectedBoxIndex(boxIndex);
    const chosenReward = mysteryRewards[boxIndex % mysteryRewards.length];
    setRevealedReward(chosenReward);

    playBoxOpenSound();
    confetti({
      particleCount: 130,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8', '#fb7185'],
    });
  };

  const handleActionBoost = (amount: number, reason: string) => {
    onIncreaseLoveMeter(amount, reason);
    playLovePingSound();
    if (loveMeter + amount >= 100 && loveMeter < 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
    }
  };

  const handleCreateCustomReward = () => {
    if (!customTitle.trim() || !customDesc.trim()) return;
    onAddCustomReward({
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      description: customDesc.trim(),
      category: 'romantic_note',
      icon: '💌',
    });
    setCustomTitle('');
    setCustomDesc('');
    setShowAddCustomModal(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  // Color gradient calculation for meter
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (loveMeter / 100) * circumference;

  return (
    <div className="space-y-6 pb-24">
      {/* Love Meter Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/80 via-slate-900/90 to-purple-950/80 border border-rose-500/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
              <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
              مؤشر الحب اليومي لحمودي & سيمو
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isUnlocked ? 'مبروك! وصلتوا لـ 100% حب 💖🎉' : `مدى الحب الحالي: ${loveMeter}%`}
            </h2>
            <p className="text-sm text-rose-200 max-w-md leading-relaxed">
              {isUnlocked
                ? 'قلوبكم اتملت حب للأخر! الصناديق الأربعة جاهزة وتحتوي على أجمل رسائل الغرام ووعود الأمان.. اختاروا صندوق واحد واقرأوا الرسالة!'
                : `ابعت إشعارات اهتمام ورسائل حب عشان المؤشر يزيد ويوصل 100% وتفتحوا صناديق الرسائل والمفاجآت الغرامية!`}
            </p>

            {/* Quick boost buttons */}
            <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <button
                onClick={() => handleActionBoost(5, 'نبضة حب')}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-900/50 border border-white/10 text-xs text-rose-200 font-semibold transition flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                نبضة حب (+5%)
              </button>
              <button
                onClick={() => handleActionBoost(8, 'حضن دافي')}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-pink-900/50 border border-white/10 text-xs text-pink-200 font-semibold transition flex items-center gap-1.5"
              >
                <Smile className="w-3.5 h-3.5 text-pink-400" />
                حضن وبوسة (+8%)
              </button>
              <button
                onClick={() => handleActionBoost(10, 'تذكير شرب مياه')}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-sky-900/50 border border-white/10 text-xs text-sky-200 font-semibold transition flex items-center gap-1.5"
              >
                <Coffee className="w-3.5 h-3.5 text-sky-400" />
                شرب مياه واهتمام (+10%)
              </button>
              {loveMeter < 100 && (
                <button
                  onClick={() => handleActionBoost(100 - loveMeter, 'شحن كامل سريع')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-bold text-xs transition shadow-md"
                >
                  🚀 فتح الصناديق الآن (100%)
                </button>
              )}
            </div>
          </div>

          {/* Circular Progress Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="52"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="52"
                stroke="url(#loveGradient)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="loveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <Heart
                className={`w-7 h-7 text-rose-400 fill-rose-500 transition-transform duration-500 ${
                  isUnlocked ? 'animate-bounce scale-110' : 'animate-pulse'
                }`}
              />
              <span className="text-2xl font-black text-white mt-0.5">{loveMeter}%</span>
              <span className="text-[10px] text-rose-300 font-medium">
                {isUnlocked ? 'مكتمل 💯' : 'في تزايد ✨'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Mystery Boxes Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-rose-400" />
              صناديق المفاجآت والرسائل الغرامية الأربعة (اختر صندوق 🎁)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isUnlocked
                ? 'اضغط على أي صندوق تفضله لفتحه وقراءة رسالة الحب السرية الخاصة بك!'
                : `الصناديق مقفولة حتى يصل مدى الحب إلى 100% (باقي ${100 - loveMeter}%)`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewingAllLetters(!viewingAllLetters)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 hover:text-white text-xs transition border border-purple-500/30 font-medium"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {viewingAllLetters ? 'إخفاء ديوان الرسائل' : 'قراءة جميع الرسائل 💌'}
            </button>

            {selectedBoxIndex !== null && (
              <button
                onClick={() => {
                  setSelectedBoxIndex(null);
                  setRevealedReward(null);
                  onResetLoveMeter();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition border border-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إعادة التحدي
              </button>
            )}
          </div>
        </div>

        {/* The 4 Boxes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((boxNum, index) => {
            const isPicked = selectedBoxIndex === index;
            const isOtherPicked = selectedBoxIndex !== null && !isPicked;

            return (
              <div
                key={boxNum}
                onClick={() => handlePickBox(index)}
                className={`relative rounded-3xl p-5 border transition-all duration-500 flex flex-col items-center text-center select-none ${
                  !isUnlocked
                    ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
                    : isPicked
                    ? 'bg-gradient-to-b from-rose-600/30 to-purple-900/40 border-rose-400 shadow-2xl shadow-rose-500/30 scale-105 ring-2 ring-rose-400'
                    : isOtherPicked
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-40 cursor-not-allowed'
                    : 'bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 border-rose-500/30 hover:border-rose-400 hover:scale-105 hover:shadow-xl hover:shadow-rose-900/20 cursor-pointer group'
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {!isUnlocked ? (
                    <Lock className="w-4 h-4 text-slate-500" />
                  ) : isPicked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-rose-400/80 group-hover:text-rose-400" />
                  )}
                </div>

                {/* Box 3D-styled Graphic */}
                <div className="my-4 relative">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-all duration-500 ${
                      !isUnlocked
                        ? 'bg-slate-800 text-slate-600'
                        : isPicked
                        ? 'bg-gradient-to-tr from-amber-400 to-rose-500 text-white animate-pulse'
                        : 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white group-hover:rotate-6 group-hover:scale-110 shadow-rose-600/30'
                    }`}
                  >
                    {isPicked ? (
                      mysteryRewards[index % mysteryRewards.length]?.icon || '💌'
                    ) : (
                      <Gift className="w-10 h-10" />
                    )}
                  </div>
                  {isUnlocked && !isOtherPicked && (
                    <Sparkles className="absolute -top-2 -left-2 w-5 h-5 text-amber-300 animate-spin" />
                  )}
                </div>

                <h4 className="font-bold text-white text-base">صندوق رقم {boxNum}</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  {!isUnlocked
                    ? 'مغلق حتى 100%'
                    : isPicked
                    ? 'تم فتحه واكتشاف الرسالة!'
                    : 'رسالة سرية ومفاجأة 💌'}
                </p>

                {isUnlocked && !isOtherPicked && !isPicked && (
                  <span className="mt-3 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                    افتح الرسالة الآن 🎁
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revealed Romantic Letter / Reward Modal (Full Royal Parchment Look) */}
      {revealedReward && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1c1326] via-[#161324] to-[#0f0e1a] border-2 border-rose-400/80 p-6 sm:p-8 shadow-2xl shadow-rose-900/50 backdrop-blur-2xl animate-in zoom-in-95 duration-400">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Letter Header */}
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg shadow-rose-500/30">
                {revealedReward.icon}
              </div>
              <div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  رسالة من أعماق القلب لحمودي & سيمو 💌
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {revealedReward.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(revealedReward.description)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold border border-white/10"
                title="نسخ الرسالة"
              >
                {copiedLetter ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedLetter ? 'تم النسخ' : 'نسخ الرسالة'}</span>
              </button>
            </div>
          </div>

          {/* Letter Body Parchment */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#2a1a36]/80 to-[#1e1528]/90 border border-rose-500/30 shadow-inner space-y-4">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-serif">
              <Feather className="w-4 h-4 text-rose-400" />
              <span>مكتوبة بحب وأمان من شريك حياتك:</span>
            </div>

            <p className="text-base sm:text-lg text-rose-100 font-medium leading-loose font-['Cairo'] tracking-wide">
              "{revealedReward.description}"
            </p>

            <div className="pt-4 border-t border-rose-500/20 flex items-center justify-between text-xs text-rose-300/80">
              <span className="flex items-center gap-1 font-bold text-white">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                عهد الأمان دائم للأبد
              </span>
              <span className="font-bold">حمودي & سيمو 🤍</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 mt-5">
            <button
              onClick={() => confetti({ particleCount: 80, spread: 70 })}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              احتفل بالرسالة! 🎉
            </button>
            <button
              onClick={() => setRevealedReward(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              إغلاق الرسالة
            </button>
          </div>
        </div>
      )}

      {/* Diwan of All Love Letters in the Boxes */}
      {viewingAllLetters && (
        <div className="rounded-3xl bg-slate-900/80 border border-purple-500/40 p-6 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              ديوان رسائل الحب المحفوظة داخل الصناديق ({mysteryRewards.length} رسالة):
            </h4>
            <span className="text-xs text-purple-300">تظهر هذه الرسائل في صناديق المفاجآت</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mysteryRewards.map((item, idx) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-850 to-slate-900 border border-rose-500/20 space-y-2 hover:border-rose-400/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                    رسالة رقم {idx + 1}
                  </span>
                </div>
                <h5 className="font-bold text-white text-sm">{item.title}</h5>
                <p className="text-xs text-rose-100/90 leading-relaxed">{item.description}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => copyToClipboard(item.description)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    نسخ الرسالة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Personal Love Letter Button */}
      <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-rose-400" />
            عاوز تكتب رسالة حب سرية خاصة بيك وتخبيها في الصناديق؟
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            اكتب كلامك الحقيقي من قلبك لـ {partnerUser.name} عشان تطلع لها مفاجأة لما تفتح الصندوق!
          </p>
        </div>

        <button
          onClick={() => setShowAddCustomModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 text-white text-xs font-bold transition shadow-md shrink-0 flex items-center gap-1.5"
        >
          <Feather className="w-3.5 h-3.5" />
          + كتابة رسالة حب جديدة
        </button>
      </div>

      {/* Modal to add custom reward / letter */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-rose-500/40 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Feather className="w-5 h-5 text-rose-400" />
              كتابة رسالة حب ومفاجأة جديدة لصناديق الحب
            </h4>
            <div>
              <label className="text-xs text-slate-300 block mb-1">عنوان الرسالة أو المفاجأة:</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="مثال: رسالة: إلى توأم روحي، وعد عمري كله..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                نص الرسالة الغرامية الجميلة (اكتب كل اللي في قلبك):
              </label>
              <textarea
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="حبيبتي سيمو.. أنا ممتن لكل ثانية بقضيها معاكي، إنتِ أماني وسندي..."
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 leading-relaxed"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateCustomReward}
                disabled={!customTitle.trim() || !customDesc.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs"
              >
                حفظ ووضع في الصناديق 💌
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
