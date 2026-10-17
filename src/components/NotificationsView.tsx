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
  Link,
  Copy,
  Download,
  Shuffle,
  ToggleLeft,
  ToggleRight,
  Sun,
  Moon,
  Sunset,
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
  onGoToTab: (tab: 'gps' | 'chat' | 'love' | 'milestones' | 'questions') => void;
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
  const [activeSubTab, setActiveSubTab] = useState<'scheduler' | 'pairing' | 'presets' | 'history'>('scheduler');

  // Scheduler Form State (By exact clock time)
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
  const [showInstallGuide, setShowInstallGuide] = useState(false);

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
      scheduledForText = `${formatTimeToArabic(exactTimeVal)} ${repeatDaily ? '(يتكرر يومياً)' : '(اليوم)'}`;
      // Calculate today's or tomorrow's timestamp for this exact time
      const [h, m] = exactTimeVal.split(':').map(Number);
      const targetDate = new Date();
      targetDate.setHours(h, m, 0, 0);
      if (targetDate.getTime() <= Date.now()) {
        targetDate.setDate(targetDate.getDate() + 1); // next day
      }
      targetTimestamp = targetDate.getTime();
    } else {
      // random_window by clock times (e.g. between 13:00 and 17:30)
      scheduledForText = `موعد غير محدد: عشوائي بين ${formatTimeToArabic(timeFromVal)} و ${formatTimeToArabic(timeToVal)}`;
      // Pick random minutes between timeFrom and timeTo
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
    <div className="space-y-6 pb-24">
      {/* Permanent Pairing & Safety Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-rose-950/80 border border-emerald-500/40 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  ✅ متصلين ببعض دائماً وغير قابلين للانفصال
                </span>
                <span className="text-[10px] text-slate-400">كود: {pairing.pairCode}</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                تطبيق الأمان لحمودي & سيمو 🤍
              </h2>
              <p className="text-xs text-slate-300">
                مساحتكم الخاصة والمحفوظة دائماً على أجهزتكم بدون انقطاع
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSubTab('pairing')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>تثبيت التطبيق ومشاركة الربط</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Action Triggers Grid (Good News, Emergency, Safe Arrival) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Good News Trigger */}
        <button
          onClick={onTriggerGoodNews}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-amber-950/40 border border-amber-500/40 hover:border-amber-400 p-4 text-right transition shadow-xl hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5 fill-amber-400" />
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
              رنة الفرحة 🎉
            </span>
          </div>
          <div className="mt-3">
            <h4 className="font-bold text-white text-base">حاجة حلوة حصلت!</h4>
            <p className="text-xs text-amber-200/80 mt-1">
              يرن فوراً بنغمة مبهجة عشان الطرف التاني يكلمك يباركلك ويسمع صوتك!
            </p>
          </div>
        </button>

        {/* Emergency SOS Trigger */}
        <button
          onClick={onTriggerEmergency}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600/25 via-slate-900 to-red-950/50 border border-red-500/50 hover:border-red-400 p-4 text-right transition shadow-xl hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-110 transition animate-pulse">
              <AlertTriangle className="w-5 h-5 fill-red-500" />
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 font-bold border border-red-500/50">
              سارينة طوارئ 🚨
            </span>
          </div>
          <div className="mt-3">
            <h4 className="font-bold text-white text-base">طوارئ SOS (إنذار عاجل)</h4>
            <p className="text-xs text-red-200/80 mt-1">
              يطلق سارينة ورنين صوتي عالي فوري ويبعت موقعك لو حصل أي ظرف طارئ.
            </p>
          </div>
        </button>

        {/* Safe Arrival */}
        <button
          onClick={onSendSafeArrival}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-slate-900 to-teal-950/40 border border-emerald-500/40 hover:border-emerald-400 p-4 text-right transition shadow-xl hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
              طمأنينة فورية 🚗
            </span>
          </div>
          <div className="mt-3">
            <h4 className="font-bold text-white text-base">أنا وصلت بالسلامة</h4>
            <p className="text-xs text-emerald-200/80 mt-1">
              يبعت إشعار فوري لـ {partnerUser.name} يطمنها إنك وصلت بدون ما تبعت على الواتس.
            </p>
          </div>
        </button>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('scheduler')}
          className={`flex items-center gap-2 pb-2 text-sm font-bold transition relative shrink-0 ${
            activeSubTab === 'scheduler' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>مواعيد الإشعارات بالوقت ({scheduledAlarms.length})</span>
          {activeSubTab === 'scheduler' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-rose-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('pairing')}
          className={`flex items-center gap-2 pb-2 text-sm font-bold transition relative shrink-0 ${
            activeSubTab === 'pairing' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>ربط الهاتفين وتثبيت التطبيق 📱</span>
          {activeSubTab === 'pairing' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-rose-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('presets')}
          className={`flex items-center gap-2 pb-2 text-sm font-bold transition relative shrink-0 ${
            activeSubTab === 'presets' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>إشعارات حب سريعة فورية</span>
          {activeSubTab === 'presets' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-rose-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 pb-2 text-sm font-bold transition relative shrink-0 ${
            activeSubTab === 'history' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>سجل الإشعارات ({pingsHistory.length})</span>
          {activeSubTab === 'history' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-rose-500 rounded-full" />
          )}
        </button>
      </div>

      {/* SUBTAB 1: EXACT CLOCK-TIME SCHEDULER */}
      {activeSubTab === 'scheduler' && (
        <div className="space-y-6">
          {/* Quick Clock Presets Buttons */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              اختيار سريع لمواعيد شائعة بالوقت:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {clockPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyClockPreset(p)}
                  className="p-2.5 rounded-2xl bg-slate-850 hover:bg-rose-950/40 hover:border-rose-500/40 border border-white/5 text-right transition"
                >
                  <span className="text-xs font-black text-rose-300 block">{p.label}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{p.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form to Set Alarm by Clock Time */}
          <div className="rounded-3xl bg-slate-900/90 border border-rose-500/30 p-6 shadow-2xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-400" />
                تحديد موعد المنبه بالوقت (بالساعة والدقيقة وليس بعد كذا) ⏰
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                حدد الوقت الذي ترغب أن يرن فيه المنبه عند {partnerUser.name} بالضبط بالساعة والدقيقة!
              </p>
            </div>

            {/* Timing Mode: Exact Clock Time or Random Clock Time Window */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAlarmMode('exact_time')}
                className={`p-4 rounded-2xl border text-right transition ${
                  alarmMode === 'exact_time'
                    ? 'bg-rose-950/60 border-rose-400 text-white ring-1 ring-rose-400 shadow-lg'
                    : 'bg-slate-850 border-white/5 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span className="font-bold text-sm">موعد محدد بالساعة والدقيقة ⏰</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  يرن في وقت محدد بالضبط (مثال: الساعة 04:30 عصراً أو 11:00 مساءً)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAlarmMode('random_window')}
                className={`p-4 rounded-2xl border text-right transition ${
                  alarmMode === 'random_window'
                    ? 'bg-purple-950/60 border-purple-400 text-white ring-1 ring-purple-400 shadow-lg'
                    : 'bg-slate-850 border-white/5 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shuffle className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-sm">موعد غير محدد بين ساعتين 🎲</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  يرن في وقت عشوائي مفاجئ بين ساعة وساعة أخرى (مثال: بين 01:00 م و 05:00 م)
                </p>
              </button>
            </div>

            {/* Exact Time Pickers */}
            {alarmMode === 'exact_time' ? (
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="text-xs font-bold text-rose-300 block mb-1">
                      اختر الساعة والدقيقة للرنين:
                    </label>
                    <input
                      type="time"
                      value={exactTimeVal}
                      onChange={(e) => setExactTimeVal(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-base text-white font-bold focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-[11px] text-rose-300 mt-1 block">
                      يرن: {formatTimeToArabic(exactTimeVal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-4">
                    <input
                      type="checkbox"
                      id="repeatCheckExact"
                      checked={repeatDaily}
                      onChange={(e) => setRepeatDaily(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 bg-slate-800 border-slate-700"
                    />
                    <label htmlFor="repeatCheckExact" className="text-xs text-slate-200 cursor-pointer font-medium">
                      تكرار المنبه يومياً في نفس هذا الوقت 🔄
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-3">
                <label className="text-xs font-bold text-purple-300 block">
                  حدد النطاق بالوقت (سيرن في وقت غير محدد ومفاجئ بينهما):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-300 block mb-1">من الساعة:</span>
                    <input
                      type="time"
                      value={timeFromVal}
                      onChange={(e) => setTimeFromVal(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    />
                    <span className="text-[10px] text-purple-300 mt-0.5 block">
                      {formatTimeToArabic(timeFromVal)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-300 block mb-1">إلى الساعة:</span>
                    <input
                      type="time"
                      value={timeToVal}
                      onChange={(e) => setTimeToVal(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    />
                    <span className="text-[10px] text-purple-300 mt-0.5 block">
                      {formatTimeToArabic(timeToVal)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Title & Message */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">عنوان المنبه أو التنبيه:</label>
                <input
                  type="text"
                  value={alarmTitle}
                  onChange={(e) => setAlarmTitle(e.target.value)}
                  placeholder="مثال: منبه شرب مياه، وحشتيني، مكالمة السهرة..."
                  className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">رسالة التنبيه:</label>
                <textarea
                  value={alarmMessage}
                  onChange={(e) => setAlarmMessage(e.target.value)}
                  placeholder="اكتب رسالة تظهر أول ما يرن المنبه..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-xl p-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">التصنيف:</span>
                  {(['love', 'care', 'surprise', 'joke'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setAlarmCategory(cat)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl transition ${
                        alarmCategory === cat
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat === 'love' && 'حب وغرام ❤️'}
                      {cat === 'care' && 'اهتمام وصحة 🥤'}
                      {cat === 'surprise' && 'مفاجأة ✨'}
                      {cat === 'joke' && 'مرح وضحك 🌸'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCreateAlarm}
                  disabled={!alarmTitle.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  حفظ وتفعيل المنبه بالوقت ⏰
                </button>
              </div>

              {showAddSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-300">
                  <Check className="w-4 h-4" />
                  تم حفظ المنبه بالوقت المحدد! هيرن عند {partnerUser.name} بالوقت المضبوط 🔔🤍
                </div>
              )}
            </div>
          </div>

          {/* List of Active Alarms */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                المنبهات المفعلة حالياً بالوقت ({scheduledAlarms.length}):
              </h4>
              <span className="text-xs text-slate-400">اضغط "رنة تجريبية" لاختبار الصوت فوراً</span>
            </div>

            <div className="space-y-3">
              {scheduledAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    alarm.active
                      ? 'bg-slate-900/80 border-rose-500/30 shadow-lg'
                      : 'bg-slate-900/40 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-white text-sm">{alarm.title}</h5>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-rose-500/20 text-rose-300 border-rose-500/30">
                          {alarm.scheduledForText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{alarm.message}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onTriggerAlarmNow(alarm)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-semibold transition border border-white/10 flex items-center gap-1"
                        title="تجربة رنين المنبه الآن"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>رنة تجريبية</span>
                      </button>

                      <button
                        onClick={() => onToggleScheduledAlarm(alarm.id)}
                        className={`p-1.5 rounded-xl transition ${
                          alarm.active ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                        title={alarm.active ? 'تعطيل مؤقت' : 'تفعيل'}
                      >
                        {alarm.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>

                      <button
                        onClick={() => onDeleteScheduledAlarm(alarm.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition"
                        title="حذف المنبه"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PAIRING & PWA INSTALLATION */}
      {activeSubTab === 'pairing' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  ربط دائم وثابت 100%
                </span>
                <h3 className="text-xl font-bold text-white mt-2">
                  ربط هاتفك بهاتف حبيبتك ليفضل شغال دايماً بدون انقطاع 📱🤍
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  حمّلوا التطبيق على الشاشة الرئيسية في موبايلك وموبايلها ليفضل شغال دائماً ومرتبطين ببعض للأبد!
                </p>
              </div>
            </div>

            {/* Pairing Code Card */}
            <div className="p-5 rounded-2xl bg-slate-850 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 block">كود الأمان والربط الدائم:</span>
                  <span className="text-2xl font-black text-rose-400 tracking-wider font-mono">
                    {pairing.pairCode}
                  </span>
                </div>

                <button
                  onClick={handleCopyPairLink}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs transition shadow-lg flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? 'تم نسخ الرابط لحبيبتك!' : 'نسخ رابط الربط المباشر لحبيبتك 🔗'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ابعت الرابط ده لـ {partnerUser.name} على الواتس.. أول ما تفتحه هيفتح التطبيق فوراً متصل بيكي وبحسابك ومش هيتشال نهائياً!
              </p>
            </div>

            {/* How to install on Mobile Homescreen */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                طريقة تثبيت التطبيق على الموبايل ليبقى شغال دايماً كأنه تطبيق من المتجر:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* iPhone Safari */}
                <div className="p-4 rounded-2xl bg-slate-850/80 border border-white/5 space-y-2">
                  <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    على الآيفون (iPhone / Safari):
                  </h5>
                  <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
                    <li>افتح الرابط في متصفح Safari.</li>
                    <li>اضغط على زر المشاركة (المربع اللي طالع منه سهم ⬆️ بالأسفل).</li>
                    <li>اختر <strong>"إضافة إلى الصفحة الرئيسية" (Add to Home Screen)</strong>.</li>
                    <li>هيظهر التطبيق بأيقونته واسم "الامان" ويفضل شغال دايماً!</li>
                  </ol>
                </div>

                {/* Android Chrome */}
                <div className="p-4 rounded-2xl bg-slate-850/80 border border-white/5 space-y-2">
                  <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    على الأندرويد (Android / Chrome):
                  </h5>
                  <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
                    <li>افتح الرابط في متصفح Chrome.</li>
                    <li>اضغط على الثلاث نقاط بالأعلى (⋮).</li>
                    <li>اختر <strong>"تثبيت التطبيق" (Install App)</strong> أو "إضافة إلى الشاشة الرئيسية".</li>
                    <li>سيتم تثبيته كتطبيق حقيقي على الموبايل ويفضل شغال دايماً!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PRESETS */}
      {activeSubTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              إشعارات حب سريعة بنقرة واحدة (بتوصل فوراً لـ {partnerUser.name}):
            </h3>
            <span className="text-xs text-slate-400">اضغط للإرسال الفوري</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SPONTANEOUS_PINGS_SUGGESTIONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSendPing(preset.title, preset.message, preset.type);
                  playLovePingSound();
                }}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-rose-950/40 hover:border-rose-500/50 border border-white/10 text-right transition group flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="p-2 rounded-xl bg-rose-500/20 text-rose-300 group-hover:scale-110 transition">
                    <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    إرسال فوري 🚀
                  </span>
                </div>
                <div className="mt-3">
                  <h5 className="font-bold text-white text-xs sm:text-sm group-hover:text-rose-200 transition">
                    {preset.title}
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.message}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: HISTORY OF NOTIFICATIONS */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              سجل التنبيهات وإشعارات الحب المتبادلة بينكما:
            </h4>
            <span className="text-xs text-slate-400">{pingsHistory.length} إشعار مسجل</span>
          </div>

          {pingsHistory.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-dashed border-slate-700 text-center text-slate-400 text-xs">
              لسه مفيش إشعارات مسجلة.. اضغط على أي إشعار جاهز فوق وابعت لحبيبتك دلوقتي! 💌
            </div>
          ) : (
            <div className="space-y-2">
              {pingsHistory.map((ping) => {
                const isSentByMe = ping.senderId === currentUserId;
                return (
                  <div
                    key={ping.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-rose-500/30 transition flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                        <BellRing className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-sm">{ping.title}</h5>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isSentByMe
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {isSentByMe ? 'مرسل مني' : `مرسل من ${partnerUser.name}`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {ping.message}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block">{ping.timestamp}</span>
                      <button
                        onClick={() => playLovePingSound()}
                        className="p-1.5 mt-1 text-slate-400 hover:text-rose-400 rounded-lg transition"
                        title="تشغيل صوت الرنة"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Quick Links to Other Features */}
      <div className="rounded-3xl bg-slate-900/40 border border-white/5 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 font-medium">تنقل سريع إلى:</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onGoToTab('chat')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            💬 الشات والريكوردات
          </button>
          <button
            onClick={() => onGoToTab('love')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            💖 مقياس الحب والصناديق الغرامية
          </button>
          <button
            onClick={() => onGoToTab('questions')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            ❓ أسئلة مفاجئة
          </button>
          <button
            onClick={() => onGoToTab('milestones')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            📅 المناسبات والذكريات
          </button>
          <button
            onClick={() => onGoToTab('gps')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-rose-400" />
            المشاوير وتتبع الـ GPS
          </button>
        </div>
      </div>
    </div>
  );
};
