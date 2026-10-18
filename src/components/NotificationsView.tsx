import React, { useState } from 'react';
import {
  BellRing,
  Heart,
  Sparkles,
  Coffee,
  Smile,
  Clock,
  Send,
  AlertTriangle,
  ShieldCheck,
  Check,
  Zap,
  Volume2,
  Calendar,
  Gift,
  HelpCircle,
  MapPin,
  RefreshCw,
  Plus,
  Trash2,
  Share2,
  Smartphone,
  Download,
  Shuffle,
  Sun,
  ChevronRight,
  Quote,
} from 'lucide-react';
import { ScheduledAlarm, SpontaneousPing, UserId, UserProfile, CouplePairing } from '../types';
import { SPONTANEOUS_PINGS_SUGGESTIONS } from '../utils/storage';
import { playLovePingSound, playGoodNewsChime } from '../utils/audio';

interface NotificationsViewProps {
  currentUserId: UserId;
  currentUser: UserProfile;
  partnerUser: UserProfile;
  pingsHistory: SpontaneousPing[];
  scheduledAlarms: ScheduledAlarm[];
  pairing: CouplePairing;
  onSendPing: (
    title: string,
    message: string,
    type: 'love_ping' | 'water' | 'smile' | 'hug' | 'mystery_alarm'
  ) => void;
  onAddScheduledAlarm: (alarm: Omit<ScheduledAlarm, 'id' | 'createdAt'>) => void;
  onToggleScheduledAlarm: (id: string) => void;
  onDeleteScheduledAlarm: (id: string) => void;
  onTriggerAlarmNow: (alarm: ScheduledAlarm) => void;
  onTriggerGoodNews: () => void;
  onTriggerEmergency: () => void;
  onSendSafeArrival: () => void;
  onGoToTab: (tab: 'gps' | 'chat' | 'love' | 'milestones' | 'questions' | 'settings') => void;
}

// Convert 24h "HH:mm" to 12h Arabic string
function formatTimeToArabic(timeStr: string): string {
  if (!timeStr) return '';
  const [hourStr, minuteStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'مساءً' : 'صباحاً';
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  return `الساعة ${hour}:${minuteStr} ${period}`;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  currentUserId,
  currentUser,
  partnerUser,
  pingsHistory,
  scheduledAlarms,
  pairing,
  onSendPing,
  onAddScheduledAlarm,
  onToggleScheduledAlarm,
  onDeleteScheduledAlarm,
  onTriggerAlarmNow,
  onTriggerGoodNews,
  onTriggerEmergency,
  onSendSafeArrival,
  onGoToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'scheduler' | 'presets' | 'history' | 'pairing'>('scheduler');

  // Scheduler Form State
  const [alarmMode, setAlarmMode] = useState<'exact_time' | 'random_window'>('exact_time');
  const [alarmTitle, setAlarmTitle] = useState('');
  const [alarmMessage, setAlarmMessage] = useState('');
  const [exactTimeVal, setExactTimeVal] = useState('16:30');
  const [timeFromVal, setTimeFromVal] = useState('13:00');
  const [timeToVal, setTimeToVal] = useState('17:30');
  const [repeatDaily, setRepeatDaily] = useState(true);
  const [alarmCategory, setAlarmCategory] = useState<ScheduledAlarm['category']>('love');
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Common Clock Presets
  const clockPresets = [
    { label: '09:00 ص', time: '09:00', title: 'صباح الخير يا روحي ☀️', msg: 'صباح الفل على عيون أجمل بنوتة في الكون.. ببدأ يومي بيكي 🤍', icon: '☀️' },
    { label: '01:30 م', time: '13:30', title: 'دعوة في نص اليوم ☕', msg: 'افتكرتك في نص الشغل ودعيت ربنا يحفظك وييسرلك يومك يا قلبي ✨', icon: '☕' },
    { label: '05:00 م', time: '17:00', title: 'وقت الرجوع والاهتمام 🚗', msg: 'طمنيني عنك أول ما تخلصي.. مستني رنتك يا روحي!', icon: '🚗' },
    { label: '09:30 م', time: '21:30', title: 'سهرة وكلام من القلب 🌙', msg: 'وحشتيني أوي.. جاهزة نتكلم ونسهر سوا شوية؟ 🤍', icon: '🌙' },
    { label: '11:45 م', time: '23:45', title: 'تصبحي على أماني 🛌', msg: 'تصبحي على ألف خير يا كل ما ليا.. ربنا يديمك في عمري لأخر يوم 💖', icon: '🛌' },
  ];

  const handleApplyClockPreset = (preset: typeof clockPresets[0]) => {
    setAlarmMode('exact_time');
    setExactTimeVal(preset.time);
    setAlarmTitle(preset.title);
    setAlarmMessage(preset.msg);
  };

  const handleCreateAlarm = () => {
    if (!alarmTitle.trim()) return;

    let scheduledForText = '';
    let targetTimestamp: number | undefined;

    if (alarmMode === 'exact_time') {
      scheduledForText = `${formatTimeToArabic(exactTimeVal)} ${repeatDaily ? '(يومياً)' : '(اليوم)'}`;
      const [h, m] = exactTimeVal.split(':').map(Number);
      const targetDate = new Date();
      targetDate.setHours(h, m, 0, 0);
      if (targetDate.getTime() <= Date.now()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      targetTimestamp = targetDate.getTime();
    } else {
      scheduledForText = `عشوائي بين ${formatTimeToArabic(timeFromVal)} و ${formatTimeToArabic(timeToVal)}`;
      const [h1, m1] = timeFromVal.split(':').map(Number);
      const [h2, m2] = timeToVal.split(':').map(Number);
      const startMinutes = h1 * 60 + m1;
      const endMinutes = h2 * 60 + m2;
      const validEnd = endMinutes > startMinutes ? endMinutes : startMinutes + 60;
      const randomTotalMinutes = Math.floor(Math.random() * (validEnd - startMinutes + 1)) + startMinutes;
      const targetDate = new Date();
      targetDate.setHours(Math.floor(randomTotalMinutes / 60), randomTotalMinutes % 60, 0, 0);
      if (targetDate.getTime() <= Date.now()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      targetTimestamp = targetDate.getTime();
    }

    onAddScheduledAlarm({
      senderId: currentUserId,
      title: alarmTitle.trim(),
      message: alarmMessage.trim() || 'تنبيه حب ورعاية مفاجئ بالوقت من حبيبك!',
      alarmType: alarmMode,
      exactTime: exactTimeVal,
      timeFrom: timeFromVal,
      timeTo: timeToVal,
      targetTimestamp,
      scheduledForText,
      active: true,
      repeatDaily,
      category: alarmCategory,
    });

    setAlarmTitle('');
    setAlarmMessage('');
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 2500);
  };

  const handleCopyPairLink = () => {
    const pairUrl = `${window.location.origin}/?pair=${pairing.pairCode}&partner=simo`;
    navigator.clipboard.writeText(pairUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-3.5 sm:space-y-5 pb-20 sm:pb-12">
      {/* Permanent Pairing & Safety Banner (Optimized for Mobile) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-rose-950/70 border border-emerald-500/30 p-3 sm:p-4.5 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  ✅ متصلين دائماً
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden xs:inline">
                  كود: {pairing.pairCode}
                </span>
              </div>
              <h2 className="text-sm sm:text-lg font-bold text-white mt-0.5 truncate leading-tight">
                تطبيق الأمان لحمودي & سيمو 🤍
              </h2>
            </div>
          </div>

          <button
            onClick={() => setActiveSubTab('pairing')}
            className="shrink-0 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] sm:text-xs font-semibold border border-white/10 flex items-center gap-1 transition active:scale-95"
            title="إعدادات الربط وتثبيت التطبيق"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">تثبيت التطبيق</span>
            <span className="xs:hidden">تثبيت 📱</span>
          </button>
        </div>
      </div>

      {/* 3 Quick Action Triggers (Ultra-compact 3-column grid on mobile: NO huge stacked cards!) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Good News Trigger */}
        <button
          onClick={onTriggerGoodNews}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-amber-950/40 border border-amber-500/40 hover:border-amber-400 p-2.5 sm:p-4 text-center sm:text-right transition shadow-md active:scale-95 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-1 sm:gap-3"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 mb-1">
              رنة الفرحة 🎉
            </span>
            <h4 className="font-bold text-white text-[11px] sm:text-sm leading-tight truncate sm:whitespace-normal">
              حاجة حلوة!
            </h4>
            <p className="text-[10px] text-amber-200/80 mt-0.5 leading-relaxed hidden sm:block">
              رنين مبهج يوصل لحبيبتك في الحال!
            </p>
          </div>
        </button>

        {/* Emergency SOS Trigger */}
        <button
          onClick={onTriggerEmergency}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600/25 via-slate-900 to-red-950/40 border border-red-500/50 hover:border-red-400 p-2.5 sm:p-4 text-center sm:text-right transition shadow-md active:scale-95 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-1 sm:gap-3"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-110 transition shrink-0 animate-pulse">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 fill-red-500" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 font-bold border border-red-500/40 mb-1">
              إنذار عاجل 🚨
            </span>
            <h4 className="font-bold text-white text-[11px] sm:text-sm leading-tight truncate sm:whitespace-normal">
              طوارئ SOS
            </h4>
            <p className="text-[10px] text-red-200/80 mt-0.5 leading-relaxed hidden sm:block">
              سارينة رنين وموقعك الفوري!
            </p>
          </div>
        </button>

        {/* Safe Arrival */}
        <button
          onClick={onSendSafeArrival}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-slate-900 to-teal-950/40 border border-emerald-500/40 hover:border-emerald-400 p-2.5 sm:p-4 text-center sm:text-right transition shadow-md active:scale-95 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-1 sm:gap-3"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 mb-1">
              طمأنينة 🚗
            </span>
            <h4 className="font-bold text-white text-[11px] sm:text-sm leading-tight truncate sm:whitespace-normal">
              أنا وصلت!
            </h4>
            <p className="text-[10px] text-emerald-200/80 mt-0.5 leading-relaxed hidden sm:block">
              إشعار سلامة سريع بدون واتساب.
            </p>
          </div>
        </button>
      </div>

      {/* Sub Tabs Navigation (Touch-Friendly Pill Carousel on Mobile) */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => setActiveSubTab('scheduler')}
          className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 active:scale-95 ${
            activeSubTab === 'scheduler'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-950'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>منبه بالوقت ({scheduledAlarms.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('presets')}
          className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 active:scale-95 ${
            activeSubTab === 'presets'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-950'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>إشعارات سريعة</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 active:scale-95 ${
            activeSubTab === 'history'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>السجل ({pingsHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pairing')}
          className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 active:scale-95 ${
            activeSubTab === 'pairing'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
          <span>ربط الهاتفين 📱</span>
        </button>
      </div>

      {/* SUBTAB 1: EXACT CLOCK-TIME SCHEDULER & ALARMS */}
      {activeSubTab === 'scheduler' && (
        <div className="space-y-3.5 sm:space-y-5">
          {/* Quick Clock Presets: Smooth Horizontal Chip Bar */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              أوقات شائعة جاهزة (اضغط لاختيار موعد فوري):
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
              {clockPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyClockPreset(p)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-850 hover:bg-rose-950/50 hover:border-rose-500/50 border border-white/5 text-right transition active:scale-95 shrink-0 flex items-center gap-1.5"
                >
                  <span className="text-xs">{p.icon}</span>
                  <span className="text-xs font-black text-rose-300 font-mono">{p.label}</span>
                  <span className="text-[11px] text-slate-300 truncate max-w-[120px]">
                    {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form to Set Alarm by Clock Time (Mobile-Perfect Layout) */}
          <div className="rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-rose-500/30 p-3.5 sm:p-5 shadow-2xl space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-400" />
                  ضبط منبه بالوقت المحدد (ساعة ودقيقة) ⏰
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug">
                  يرن عند {partnerUser.name} بالوقت المضبوط بالساعة والدقيقة!
                </p>
              </div>
            </div>

            {/* Timing Mode Segmented Control (Side by side on all screens) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/70 rounded-2xl border border-white/5">
              <button
                type="button"
                onClick={() => setAlarmMode('exact_time')}
                className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                  alarmMode === 'exact_time'
                    ? 'bg-rose-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">موعد محدد بالضبط</span>
              </button>

              <button
                type="button"
                onClick={() => setAlarmMode('random_window')}
                className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                  alarmMode === 'random_window'
                    ? 'bg-purple-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="text-xs">عشوائي بين ساعتين</span>
              </button>
            </div>

            {/* Exact Time Pickers */}
            {alarmMode === 'exact_time' ? (
              <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-rose-300 block mb-1">
                      الساعة والدقيقة للرنين:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={exactTimeVal}
                        onChange={(e) => setExactTimeVal(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-base text-white font-bold text-center focus:outline-none focus:border-rose-500 w-36"
                      />
                      <span className="text-xs font-bold text-rose-200">
                        {formatTimeToArabic(exactTimeVal)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 sm:pt-0">
                    <input
                      type="checkbox"
                      id="repeatCheckExact"
                      checked={repeatDaily}
                      onChange={(e) => setRepeatDaily(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 bg-slate-800 border-slate-700 cursor-pointer"
                    />
                    <label htmlFor="repeatCheckExact" className="text-xs text-slate-200 cursor-pointer font-medium select-none">
                      تكرار المنبه يومياً 🔄
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                <label className="text-[11px] font-bold text-purple-300 block">
                  حدد النطاق الزمني (سيرن مفاجئ في وقت غير محدد بينهما):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">من الساعة:</span>
                    <input
                      type="time"
                      value={timeFromVal}
                      onChange={(e) => setTimeFromVal(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-sm text-white text-center"
                    />
                    <span className="text-[10px] text-purple-300 mt-0.5 block truncate">
                      {formatTimeToArabic(timeFromVal)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">إلى الساعة:</span>
                    <input
                      type="time"
                      value={timeToVal}
                      onChange={(e) => setTimeToVal(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-sm text-white text-center"
                    />
                    <span className="text-[10px] text-purple-300 mt-0.5 block truncate">
                      {formatTimeToArabic(timeToVal)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Title & Message */}
            <div className="space-y-2.5">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">عنوان المنبه:</label>
                <input
                  type="text"
                  value={alarmTitle}
                  onChange={(e) => setAlarmTitle(e.target.value)}
                  placeholder="مثال: منبه شرب مياه، وحشتيني، مكالمة السهرة..."
                  className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">رسالة المنبه:</label>
                <textarea
                  value={alarmMessage}
                  onChange={(e) => setAlarmMessage(e.target.value)}
                  placeholder="اكتب رسالة تظهر أول ما يرن المنبه..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-xl p-2.5 text-sm text-white focus:outline-none leading-relaxed"
                />
              </div>

              {/* Categories & Submit Button (Mobile Optimized) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  <span className="text-[11px] text-slate-400 shrink-0">النوع:</span>
                  {(['love', 'care', 'surprise', 'joke'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setAlarmCategory(cat)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl transition shrink-0 ${
                        alarmCategory === cat
                          ? 'bg-rose-500 text-white font-bold shadow'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat === 'love' && 'حب ❤️'}
                      {cat === 'care' && 'اهتمام 🥤'}
                      {cat === 'surprise' && 'مفاجأة ✨'}
                      {cat === 'joke' && 'مرح 🌸'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCreateAlarm}
                  disabled={!alarmTitle.trim()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  حفظ وتفعيل المنبه بالوقت ⏰
                </button>
              </div>

              {showAddSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-300">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>تم حفظ المنبه بالوقت بنجاح! هيرن عند {partnerUser.name} في الموعد المحدد 🔔🤍</span>
                </div>
              )}
            </div>
          </div>

          {/* List of Active Alarms (RESTRUCTURED FOR FLAWLESS MOBILE & DESKTOP ALIGNMENT) */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-400" />
                المنبهات المفعلة حالياً بالوقت ({scheduledAlarms.length}):
              </h4>
              <span className="text-[10px] sm:text-[11px] text-slate-400">
                رنة صوتية فورية
              </span>
            </div>

            {scheduledAlarms.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 text-center text-slate-400 text-xs">
                مفيش منبهات مضافة حالياً.. حدد موعد بالوقت فوق واضغط حفظ! ⏰
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-2.5">
                {scheduledAlarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    className={`rounded-2xl p-3 sm:p-4 border transition-all space-y-2.5 ${
                      alarm.active
                        ? 'bg-slate-900/90 border-rose-500/30 shadow-lg'
                        : 'bg-slate-900/50 border-white/5 opacity-60'
                    }`}
                  >
                    {/* Header Row: Category Icon + Title + Time Badge + Active Toggle */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-sm shrink-0 mt-0.5">
                          {alarm.category === 'care' ? '🥤' : alarm.category === 'surprise' ? '✨' : alarm.category === 'joke' ? '🌸' : '❤️'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-white text-xs sm:text-sm leading-tight break-words">
                            {alarm.title}
                          </h5>
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 whitespace-nowrap">
                              <Clock className="w-2.5 h-2.5 text-rose-400" />
                              {alarm.scheduledForText}
                            </span>
                            {alarm.repeatDaily && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/5 whitespace-nowrap">
                                🔄 يومياً
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Active Status & Toggle Switch */}
                      <button
                        onClick={() => onToggleScheduledAlarm(alarm.id)}
                        className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] sm:text-xs font-bold transition active:scale-95 ${
                          alarm.active
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-white/5'
                        }`}
                        title={alarm.active ? 'تعطيل مؤقت' : 'تفعيل'}
                      >
                        <span className={`w-2 h-2 rounded-full ${alarm.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        <span>{alarm.active ? 'مفعل' : 'متوقف'}</span>
                      </button>
                    </div>

                    {/* Middle: Romantic Message Bubble */}
                    {alarm.message && (
                      <div className="p-2 sm:p-2.5 rounded-xl bg-slate-850/80 border border-white/5 text-[11px] sm:text-xs text-slate-200 leading-relaxed break-words flex items-start gap-1.5">
                        <Quote className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                        <span className="flex-1">{alarm.message}</span>
                      </div>
                    )}

                    {/* Footer Row: Actions (Test Ring & Delete cleanly separated) */}
                    <div className="pt-1.5 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onTriggerAlarmNow(alarm)}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white text-[11px] sm:text-xs font-semibold transition border border-white/10 flex items-center gap-1 active:scale-95"
                        title="تجربة رنين المنبه الآن"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>تجربة رنين الآن 🔔</span>
                      </button>

                      <button
                        onClick={() => onDeleteScheduledAlarm(alarm.id)}
                        className="p-1 sm:px-2 sm:py-1 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition text-xs flex items-center gap-1 active:scale-95"
                        title="حذف المنبه"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PRESETS (FAST 1-TAP LOVE PINGS) */}
      {activeSubTab === 'presets' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              إشعارات حب سريعة بنقرة واحدة (بتوصل فوراً لـ {partnerUser.name}):
            </h3>
            <span className="text-[10px] text-slate-400">إرسال فوري</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
            {SPONTANEOUS_PINGS_SUGGESTIONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSendPing(preset.title, preset.message, preset.type);
                  playLovePingSound();
                }}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-rose-950/40 hover:border-rose-500/50 border border-white/10 text-right transition group flex flex-col justify-between shadow-md active:scale-98 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 group-hover:scale-110 transition">
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-rose-300 font-bold border border-rose-500/20">
                    إرسال فوري 🚀
                  </span>
                </div>
                <div>
                  <h5 className="font-bold text-white text-xs group-hover:text-rose-200 transition">
                    {preset.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.message}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: HISTORY OF NOTIFICATIONS (CLEAN MOBILE STACK) */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-400" />
              سجل التنبيهات وإشعارات الحب المتبادلة بينكما:
            </h4>
            <span className="text-[10px] text-slate-400">{pingsHistory.length} مسجل</span>
          </div>

          {pingsHistory.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 text-center text-slate-400 text-xs">
              لسه مفيش إشعارات مسجلة.. اضغط على أي إشعار جاهز وابعت لحبيبتك دلوقتي! 💌
            </div>
          ) : (
            <div className="space-y-2">
              {pingsHistory.map((ping) => {
                const isSentByMe = ping.senderId === currentUserId;
                return (
                  <div
                    key={ping.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-rose-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                        <BellRing className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h5 className="font-bold text-white text-xs">{ping.title}</h5>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                              isSentByMe
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {isSentByMe ? 'مرسل مني' : `مرسل من ${partnerUser.name}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed break-words">
                          {ping.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono">{ping.timestamp}</span>
                      <button
                        onClick={() => playLovePingSound()}
                        className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-300 text-[11px] flex items-center gap-1 transition active:scale-95"
                        title="تشغيل صوت الرنة"
                      >
                        <Volume2 className="w-3 h-3 text-rose-400" />
                        <span>رنة</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: PAIRING & PWA INSTALLATION */}
      {activeSubTab === 'pairing' && (
        <div className="space-y-3.5 sm:space-y-5">
          <div className="rounded-2xl sm:rounded-3xl bg-slate-900 border border-emerald-500/40 p-4 sm:p-5 shadow-2xl space-y-3.5 sm:space-y-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                ربط دائم وثابت 100%
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1.5 leading-snug">
                ربط هاتفك بهاتف حبيبتك ليفضل شغال دايماً بدون انقطاع 📱🤍
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                حمّلوا التطبيق على الشاشة الرئيسية في موبايلك وموبايلها ليفضل شغال دائماً ومرتبطين ببعض للأبد!
              </p>
            </div>

            {/* Pairing Code Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-850 border border-white/10 space-y-2.5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <span className="text-[11px] text-slate-400 block">كود الأمان والربط الدائم:</span>
                  <span className="text-xl sm:text-2xl font-black text-rose-400 tracking-wider font-mono">
                    {pairing.pairCode}
                  </span>
                </div>

                <button
                  onClick={handleCopyPairLink}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'تم نسخ الرابط لحبيبتك!' : 'نسخ رابط الربط المباشر لحبيبتك 🔗'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                ابعت الرابط ده لـ {partnerUser.name} على الواتس.. أول ما تفتحه هيفتح التطبيق فوراً متصل بيكي وبحسابك ومش هيتشال نهائياً!
              </p>
            </div>

            {/* How to install on Mobile Homescreen */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                طريقة تثبيت التطبيق على الموبايل ليبقى شغال دايماً:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* iPhone Safari */}
                <div className="p-3 rounded-xl bg-slate-850/80 border border-white/5 space-y-1.5">
                  <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                    على الآيفون (iPhone / Safari):
                  </h5>
                  <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
                    <li>افتح الرابط في متصفح Safari.</li>
                    <li>اضغط على زر المشاركة (المربع بسهم ⬆️ بالأسفل).</li>
                    <li>اختر <strong>"إضافة إلى الصفحة الرئيسية"</strong>.</li>
                    <li>هيظهر التطبيق باسم "الامان" ويفضل شغال دايماً!</li>
                  </ol>
                </div>

                {/* Android Chrome */}
                <div className="p-3 rounded-xl bg-slate-850/80 border border-white/5 space-y-1.5">
                  <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    على الأندرويد (Android / Chrome):
                  </h5>
                  <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
                    <li>افتح الرابط في متصفح Chrome.</li>
                    <li>اضغط على الثلاث نقاط بالأعلى (⋮).</li>
                    <li>اختر <strong>"تثبيت التطبيق"</strong> أو "إضافة إلى الشاشة الرئيسية".</li>
                    <li>سيتم تثبيته كتطبيق حقيقي على الموبايل ويفضل شغال دايماً!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links to Other Features (Clean wrap on mobile) */}
      <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-400 font-medium text-[11px]">تنقل سريع:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onGoToTab('chat')}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
          >
            💬 الشات
          </button>
          <button
            onClick={() => onGoToTab('love')}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
          >
            💖 مقياس الحب
          </button>
          <button
            onClick={() => onGoToTab('questions')}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
          >
            ❓ أسئلة مفاجئة
          </button>
          <button
            onClick={() => onGoToTab('milestones')}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
          >
            📅 المناسبات
          </button>
          <button
            onClick={() => onGoToTab('gps')}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-rose-400" />
            الـ GPS
          </button>
          <button
            onClick={() => onGoToTab('settings')}
            className="px-2.5 py-1 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-purple-200 text-xs transition flex items-center gap-1 border border-purple-500/30 font-bold"
          >
            ⚙️ تعديل التطبيق
          </button>
        </div>
      </div>
    </div>
  );
};
