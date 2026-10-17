import React from 'react';
import {
  Shield,
  Heart,
  AlertTriangle,
  Sparkles,
  BellRing,
  Navigation,
  MessageCircle,
  Calendar,
  HelpCircle,
  Gift,
  MapPin,
} from 'lucide-react';
import { UserId, UserProfile } from '../types';

export type AppTabType = 'notifications' | 'chat' | 'love' | 'milestones' | 'questions' | 'gps';

interface NavbarProps {
  currentUserId: UserId;
  currentUser: UserProfile;
  partnerUser: UserProfile;
  activeTab: AppTabType;
  onTabChange: (tab: AppTabType) => void;
  onSwitchUser: (id: UserId) => void;
  loveMeter: number;
  onTriggerEmergency: () => void;
  onTriggerGoodNews: () => void;
  onOpenSpontaneousPings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUserId,
  currentUser,
  partnerUser,
  activeTab,
  onTabChange,
  onSwitchUser,
  loveMeter,
  onTriggerEmergency,
  onTriggerGoodNews,
  onOpenSpontaneousPings,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-slate-950/85 border-b border-white/10 shadow-xl">
      {/* Upper Bar: Branding, User Switcher, Quick Emergency & Good News triggers */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 shadow-lg shadow-rose-600/30">
            <Shield className="w-5 h-5 text-white" />
            <Heart className="w-3 h-3 text-white fill-white absolute bottom-1 right-1" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-wide">الامـان</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
                حمودي & سيمو
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              مساحتنا الخاصة للإشعارات، الشات، ورعاية بعض 🤍
            </p>
          </div>
        </div>

        {/* Center: Profile Switcher (I am Hamoudi / I am Simo) */}
        <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-2xl p-1 shadow-inner">
          <button
            onClick={() => onSwitchUser('hamoudi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentUserId === 'hamoudi'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-300" />
            حمودي
          </button>
          <button
            onClick={() => onSwitchUser('simo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentUserId === 'simo'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-300" />
            سيمو 👑
          </button>
        </div>

        {/* Right: Quick Action Buttons (Good News, Spontaneous Ping, Emergency SOS) */}
        <div className="flex items-center gap-2">
          {/* Spontaneous Ping / Random Love Alarm */}
          <button
            onClick={onOpenSpontaneousPings}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-rose-500/50 text-slate-200 hover:text-rose-300 text-xs font-semibold transition flex items-center gap-1.5 shadow"
            title="منبه عشوائي وإشعار حب مفاجئ"
          >
            <BellRing className="w-4 h-4 text-rose-400" />
            <span className="hidden md:inline">منبه حب مفاجئ</span>
          </button>

          {/* Good News Button */}
          <button
            onClick={onTriggerGoodNews}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500 hover:to-orange-500 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold transition shadow flex items-center gap-1.5"
            title="حاجة حلوة حصلت! يرن للتاني عشان يكلمه فورا"
          >
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">حاجة حلوة حصلت! 🎉</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onTriggerEmergency}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black transition shadow-lg shadow-red-900/40 flex items-center gap-1.5 animate-pulse"
            title="طوارئ SOS: يرن فوراً وبصوت عالي ويبعت موقعك"
          >
            <AlertTriangle className="w-4 h-4 fill-current" />
            <span>طوارئ SOS</span>
          </button>
        </div>
      </div>

      {/* Main App Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 border-t border-white/5">
        <nav className="flex items-center justify-between sm:justify-center gap-1 sm:gap-3 py-2 overflow-x-auto no-scrollbar">
          {/* 1. Notifications & Spontaneous Alarms (FIRST TAB) */}
          <button
            onClick={() => onTabChange('notifications')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'notifications'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BellRing className="w-4 h-4 text-rose-400" />
            <span>الإشعارات والمنبه</span>
          </button>

          {/* 2. Chat */}
          <button
            onClick={() => onTabChange('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'chat'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-pink-400" />
            <span>شات وصور وريكوردات</span>
          </button>

          {/* 3. Love Meter & Mystery Boxes */}
          <button
            onClick={() => onTabChange('love')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'love'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="flex items-center gap-1.5">
              مقياس الحب & الصناديق
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/40 text-rose-200">
                {loveMeter}%
              </span>
            </span>
          </button>

          {/* 4. Milestones */}
          <button
            onClick={() => onTabChange('milestones')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'milestones'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>المناسبات والتواريخ</span>
          </button>

          {/* 5. Daily Questions */}
          <button
            onClick={() => onTabChange('questions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'questions'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span>أسئلة مفاجئة</span>
          </button>

          {/* 6. GPS / Location Tracking (MOVED TO THE VERY END AS REQUESTED) */}
          <button
            onClick={() => onTabChange('gps')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'gps'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Navigation className="w-4 h-4 text-rose-400" />
            <span>المشاوير والـ GPS</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
