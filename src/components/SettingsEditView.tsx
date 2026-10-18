import React, { useState, useRef } from 'react';
import {
  Settings,
  User,
  Heart,
  Smartphone,
  Save,
  RotateCcw,
  Camera,
  BellRing,
  Gift,
  Calendar,
  Lock,
  Unlock,
  Check,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageSquare,
  Share2,
  Trash2,
  Plus,
  Radio,
} from 'lucide-react';
import {
  UserId,
  UserProfile,
  MysteryBoxReward,
  AppSettings,
  CouplePairing,
} from '../types';
import { playGoodNewsChime, playLovePingSound } from '../utils/audio';

interface SettingsEditViewProps {
  currentUserId: UserId;
  users: Record<UserId, UserProfile>;
  settings: AppSettings;
  pairing: CouplePairing;
  mysteryRewards: MysteryBoxReward[];
  onUpdateUsers: (newUsers: Record<UserId, UserProfile>) => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onUpdatePairing: (newPairing: CouplePairing) => void;
  onUpdateMysteryRewards: (rewards: MysteryBoxReward[]) => void;
  onSwitchDeviceUser: (id: UserId) => void;
  onSimulatePartnerOpenApp: () => void;
  onResetAllData: () => void;
}

export const SettingsEditView: React.FC<SettingsEditViewProps> = ({
  currentUserId,
  users,
  settings,
  pairing,
  mysteryRewards,
  onUpdateUsers,
  onUpdateSettings,
  onUpdatePairing,
  onUpdateMysteryRewards,
  onSwitchDeviceUser,
  onSimulatePartnerOpenApp,
  onResetAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'device' | 'love_story' | 'rewards'>('profiles');

  // Hamoudi Form
  const [hamoudiName, setHamoudiName] = useState(users.hamoudi.name);
  const [hamoudiNickname, setHamoudiNickname] = useState(users.hamoudi.nickname);
  const [hamoudiPhone, setHamoudiPhone] = useState(users.hamoudi.phone);
  const [hamoudiStatus, setHamoudiStatus] = useState(users.hamoudi.status);
  const [hamoudiAvatar, setHamoudiAvatar] = useState(users.hamoudi.avatar);

  // Simo Form
  const [simoName, setSimoName] = useState(users.simo.name);
  const [simoNickname, setSimoNickname] = useState(users.simo.nickname);
  const [simoPhone, setSimoPhone] = useState(users.simo.phone);
  const [simoStatus, setSimoStatus] = useState(users.simo.status);
  const [simoAvatar, setSimoAvatar] = useState(users.simo.avatar);

  // App & Relationship Settings
  const [appTitle, setAppTitle] = useState(settings.appTitle);
  const [appSubtitle, setAppSubtitle] = useState(settings.subtitle);
  const [startDate, setStartDate] = useState(settings.relationshipStartDate);
  const [lockDevice, setLockDevice] = useState(settings.lockDeviceRole);
  const [notifyOnOpen, setNotifyOnOpen] = useState(settings.notifyWhenPartnerOpens);
  const [pairCode, setPairCode] = useState(pairing.pairCode);

  // Mystery Box Rewards
  const [rewardsList, setRewardsList] = useState<MysteryBoxReward[]>(mysteryRewards);
  const [editingRewardIndex, setEditingRewardIndex] = useState<number | null>(null);

  // Success indicator
  const [showSavedToast, setShowSavedToast] = useState(false);

  const fileInputHamoudi = useRef<HTMLInputElement | null>(null);
  const fileInputSimo = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = () => {
    // 1. Update Profiles
    const updatedUsers: Record<UserId, UserProfile> = {
      hamoudi: {
        ...users.hamoudi,
        name: hamoudiName.trim() || 'حمودي',
        nickname: hamoudiNickname.trim() || 'روحي و سندي 🤍',
        phone: hamoudiPhone.trim() || '+201012345678',
        status: hamoudiStatus.trim() || 'بيفكر في سيمو 💭',
        avatar: hamoudiAvatar,
      },
      simo: {
        ...users.simo,
        name: simoName.trim() || 'سيمو',
        nickname: simoNickname.trim() || 'حبيبتي وأميرتي 👑❤️',
        phone: simoPhone.trim() || '+201087654321',
        status: simoStatus.trim() || 'في البيت 🏠✨',
        avatar: simoAvatar,
      },
    };
    onUpdateUsers(updatedUsers);

    // 2. Update App Settings
    const updatedSettings: AppSettings = {
      ...settings,
      appTitle: appTitle.trim() || 'الامـان',
      subtitle: appSubtitle.trim() || 'حمودي & سيمو 🤍',
      relationshipStartDate: startDate,
      lockDeviceRole: lockDevice,
      notifyWhenPartnerOpens: notifyOnOpen,
    };
    onUpdateSettings(updatedSettings);

    // 3. Update Pairing
    onUpdatePairing({
      ...pairing,
      pairCode: pairCode.trim() || pairing.pairCode,
    });

    // 4. Update Mystery Rewards
    onUpdateMysteryRewards(rewardsList);

    playGoodNewsChime();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleUpdateRewardText = (index: number, newTitle: string, newDesc: string) => {
    const next = [...rewardsList];
    next[index] = {
      ...next[index],
      title: newTitle,
      description: newDesc,
    };
    setRewardsList(next);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-rose-950/80 border border-purple-500/30 p-4 sm:p-5 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  لوحة التحكم والتعديل الشاملة ⚙️
                </span>
                <span className="text-[10px] text-slate-400">
                  تعديل كل تفصيلة في التطبيق
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white mt-1 leading-snug">
                خانة تعديل التطبيق بالكامل لحمودي & سيمو 🤍
              </h2>
            </div>
          </div>

          <button
            onClick={handleSaveAll}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>حفظ وتطبيق كل التعديلات 💾</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {showSavedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-300 shadow-xl">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">
            تم حفظ جميع التعديلات بنجاح! تم تحديث البيانات في كل أقسام التطبيق فوراً ✨
          </span>
        </div>
      )}

      {/* Subtabs for Settings */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'profiles'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>تعديل بيانات الحسابين (حمودي وسيمو)</span>
        </button>

        <button
          onClick={() => setActiveTab('device')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'device'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>هوية الهاتف وقفل الحساب 📱</span>
        </button>

        <button
          onClick={() => setActiveTab('love_story')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'love_story'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-300" />
          <span>حكاية حبنا وتاريخ البداية 💍</span>
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'rewards'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>رسائل الصناديق الأربعة 🎁</span>
        </button>
      </div>

      {/* TAB 1: PROFILES EDITING (HAMOUDI & SIMO) */}
      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Hamoudi Profile Card */}
          <div className="rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-sky-500/30 p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  بيانات حساب حمودي 🤍
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                حساب السند والراعي
              </span>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-sky-500/40 shrink-0">
                <img
                  src={hamoudiAvatar}
                  alt={hamoudiName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <input
                  type="file"
                  ref={fileInputHamoudi}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setHamoudiAvatar)}
                />
                <button
                  type="button"
                  onClick={() => fileInputHamoudi.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>تغيير صورة حمودي من الهاتف</span>
                </button>
                <input
                  type="text"
                  value={hamoudiAvatar}
                  onChange={(e) => setHamoudiAvatar(e.target.value)}
                  placeholder="أو أدخل رابط الصورة..."
                  className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-2.5 py-1 text-[11px] text-slate-300"
                />
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">الاسم المعروض:</label>
                <input
                  type="text"
                  value={hamoudiName}
                  onChange={(e) => setHamoudiName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-sky-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">اسم الدلع واللقب:</label>
                <input
                  type="text"
                  value={hamoudiNickname}
                  onChange={(e) => setHamoudiNickname(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-sky-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">رقم الهاتف (للاتصال والطوارئ):</label>
                <input
                  type="tel"
                  value={hamoudiPhone}
                  onChange={(e) => setHamoudiPhone(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-sky-500 rounded-xl px-3 py-2 text-sm text-white text-right focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">الحالة المكتوبة (Status):</label>
                <input
                  type="text"
                  value={hamoudiStatus}
                  onChange={(e) => setHamoudiStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-sky-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Simo Profile Card */}
          <div className="rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-rose-500/30 p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  بيانات حساب سيمو 👑❤️
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                حساب أميرة القلب
              </span>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-rose-500/40 shrink-0">
                <img
                  src={simoAvatar}
                  alt={simoName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <input
                  type="file"
                  ref={fileInputSimo}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setSimoAvatar)}
                />
                <button
                  type="button"
                  onClick={() => fileInputSimo.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>تغيير صورة سيمو من الهاتف</span>
                </button>
                <input
                  type="text"
                  value={simoAvatar}
                  onChange={(e) => setSimoAvatar(e.target.value)}
                  placeholder="أو أدخل رابط الصورة..."
                  className="w-full bg-slate-850 border border-slate-700/80 rounded-xl px-2.5 py-1 text-[11px] text-slate-300"
                />
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">الاسم المعروض:</label>
                <input
                  type="text"
                  value={simoName}
                  onChange={(e) => setSimoName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">اسم الدلع واللقب:</label>
                <input
                  type="text"
                  value={simoNickname}
                  onChange={(e) => setSimoNickname(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">رقم الهاتف (للاتصال والطوارئ):</label>
                <input
                  type="tel"
                  value={simoPhone}
                  onChange={(e) => setSimoPhone(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-sm text-white text-right focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">الحالة المكتوبة (Status):</label>
                <input
                  type="text"
                  value={simoStatus}
                  onChange={(e) => setSimoStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEVICE IDENTITY & ROLE LOCKING (THIS DEVICE BELONGS TO HAMOUDI / SIMO) */}
      {activeTab === 'device' && (
        <div className="rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-sky-500/30 p-4 sm:p-6 shadow-2xl space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-sky-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                هوية هذا الهاتف وفصل الحسابين 📱
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              لتحديد صاحب هذا الهاتف (حمودي أو سيمو) بحيث يشتغل التطبيق عند كل طرف بحسابه الخاص دون أن يتداخل حساب الآخر!
            </p>
          </div>

          {/* Current Device Status Box */}
          <div className="p-4 rounded-2xl bg-slate-850 border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 block">هذا الهاتف مسجل ومقفل حالياً باسم:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {currentUserId === 'hamoudi' ? `هاتف ${hamoudiName} 📱` : `هاتف ${simoName} 👑`}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    نشط على هذا الجهاز
                  </span>
                </div>
              </div>

              {/* Toggle to other device role */}
              <button
                type="button"
                onClick={() => {
                  const newRole = currentUserId === 'hamoudi' ? 'simo' : 'hamoudi';
                  onSwitchDeviceUser(newRole);
                  playLovePingSound();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>تبديل صاحب هذا الهاتف إلى ({currentUserId === 'hamoudi' ? simoName : hamoudiName})</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-2">
              عند قفل هذا الهاتف على {currentUserId === 'hamoudi' ? hamoudiName : simoName}، فإن كل رسائل الشات والإشعارات تصدر باسمك، والطرف الآخر يتلقاها على هاتفه باسم شريكه.
            </p>
          </div>

          {/* Automatic alert when Simo opens the app */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  تنبيه فوري أول ما سيمو تفتح التطبيق 🌸
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  أول ما سيمو تفتح التطبيق على هاتفها، يوصلك فوراً إشعار وصوت نغمة حلوة يبلغك: "سيمو فتحت التطبيق وبقت أونلاين معاك!"
                </p>
              </div>

              <input
                type="checkbox"
                id="notifyOpenCheck"
                checked={notifyOnOpen}
                onChange={(e) => setNotifyOnOpen(e.target.checked)}
                className="w-5 h-5 rounded text-rose-600 bg-slate-800 border-slate-700 cursor-pointer shrink-0 mt-1 sm:mt-0"
              />
            </div>

            {/* Test Simulation Button */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                اختبر التنبيه دلوقتي:
              </span>
              <button
                type="button"
                onClick={onSimulatePartnerOpenApp}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white text-xs font-bold transition flex items-center gap-1 active:scale-95"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>تجربة تنبيه "سيمو فتحت التطبيق" 🔔</span>
              </button>
            </div>
          </div>

          {/* Account Lock Option */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-850 border border-white/5">
            <div className="space-y-0.5">
              <label htmlFor="lockDeviceCheck" className="text-xs font-bold text-white block cursor-pointer">
                قفل واجهة الحساب على هذا الهاتف 🔒
              </label>
              <p className="text-[11px] text-slate-400">
                إخفاء أزرار التبديل من الشاشة الرئيسية لمنع التبديل العشوائي بين الحسابين.
              </p>
            </div>
            <input
              type="checkbox"
              id="lockDeviceCheck"
              checked={lockDevice}
              onChange={(e) => setLockDevice(e.target.checked)}
              className="w-5 h-5 rounded text-sky-600 bg-slate-800 border-slate-700 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* TAB 3: RELATIONSHIP & LOVE STORY SETTINGS */}
      {activeTab === 'love_story' && (
        <div className="rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-purple-500/30 p-4 sm:p-6 shadow-2xl space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              حكاية حبنا وتاريخ البداية 💍
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              يتم هنا تحديد تاريخ بداية الحب لحساب عداد الأيام وعمر العلاقة تلقائياً.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                تاريخ بداية الحب / أول لقاء (لحساب عداد الأيام):
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-800 border border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">عنوان التطبيق الرئيسي:</label>
              <input
                type="text"
                value={appTitle}
                onChange={(e) => setAppTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">العنوان الفرعي والشعار:</label>
              <input
                type="text"
                value={appSubtitle}
                onChange={(e) => setAppSubtitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">كود الأمان والربط الدائم بين الهاتفين:</label>
              <input
                type="text"
                value={pairCode}
                onChange={(e) => setPairCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MYSTERY BOX REWARDS & LETTERS EDITING */}
      {activeTab === 'rewards' && (
        <div className="rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-amber-500/30 p-4 sm:p-6 shadow-2xl space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                تعديل رسائل الصناديق الأربعة وديوان الحب 💌
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              اكتب وعدل بنفسك الرسائل التي تظهر لحبيبتك عند فتح أي صندوق من الصناديق الأربعة بعد وصول مقياس الحب إلى 100%!
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {rewardsList.map((reward, idx) => (
              <div
                key={reward.id || idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-850 border border-white/5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>{reward.icon}</span>
                    <span>رسالة الصندوق #{idx + 1}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {reward.category === 'romantic_note' ? 'رسالة حب سرية' : 'قسيمة تدليل'}
                  </span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">عنوان الرسالة:</label>
                  <input
                    type="text"
                    value={reward.title}
                    onChange={(e) => handleUpdateRewardText(idx, e.target.value, reward.description)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">نص الرسالة الغرامية الكاملة:</label>
                  <textarea
                    rows={3}
                    value={reward.description}
                    onChange={(e) => handleUpdateRewardText(idx, reward.title, e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-xs text-white leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
        <button
          type="button"
          onClick={handleSaveAll}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <Save className="w-4 h-4" />
          <span>حفظ وتطبيق جميع التعديلات فوراً 💾</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('هل أنت متأكد من استعادة الإعدادات الأصلية الافتراضية؟')) {
              onResetAllData();
            }
          }}
          className="px-3.5 py-2 text-xs text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة الإعدادات الأصلية</span>
        </button>
      </div>
    </div>
  );
};
