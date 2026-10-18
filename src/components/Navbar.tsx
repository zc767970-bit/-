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
  Settings,
  Lock,
} from 'lucide-react';
import { UserId, UserProfile } from '../types';

export type AppTabType = 'notifications' | 'chat' | 'love' | 'milestones' | 'questions' | 'gps' | 'settings';

interface NavbarProps {
  currentUserId: UserId;
  currentUser: UserProfile;
  partnerUser: UserProfile;
  activeTab: AppTabType;
  onTabChange: (tab: AppTabType) => void;
  onSwitchUser: (id: UserId) => void;
  loveMeter: number;
  lockDeviceRole: boolean;
  isPartnerOnline: boolean;
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
  lockDeviceRole,
  isPartnerOnline,
  onTriggerEmergency,
  onTriggerGoodNews,
  onOpenSpontaneousPings,
}) => {
  return (
    <>
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-slate-950/90 border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 shadow-md shadow-rose-600/30">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-white absolute bottom-0.5 right-0.5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-lg font-black text-white tracking-wide">الامـان</h1>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  حمودي & سيمو
                </span>
              </div>
              {/* Partner live presence indicator */}
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPartnerOnline ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                  }`}
                />
                <span className={isPartnerOnline ? 'text-emerald-300 font-semibold' : ''}>
                  {partnerUser.name}: {isPartnerOnline ? 'متصلة الآن 🟢' : 'نشطة مؤخراً'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Switcher / Device Owner badge */}
          <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-xl sm:rounded-2xl p-0.5 shadow-inner shrink-0">
            <button
              onClick={() => onSwitchUser('hamoudi')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                currentUserId === 'hamoudi'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="هاتف حمودي"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300" />
              <span>حمودي</span>
              {lockDeviceRole && currentUserId === 'hamoudi' && (
                <Lock className="w-2.5 h-2.5 text-sky-200 hidden xs:inline" />
              )}
            </button>
            <button
              onClick={() => onSwitchUser('simo')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                currentUserId === 'simo'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="هاتف سيمو"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
              <span>سيمو 👑</span>
              {lockDeviceRole && currentUserId === 'simo' && (
                <Lock className="w-2.5 h-2.5 text-rose-200 hidden xs:inline" />
              )}
            </button>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Settings & Edit everything button */}
            <button
              onClick={() => onTabChange('settings')}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
                activeTab === 'settings'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                  : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-purple-500/40'
              }`}
              title="تعديل التطبيق بالكامل (خانة التعديل والتحكم)"
            >
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">تعديل التطبيق ⚙️</span>
            </button>

            {/* Good News Trigger */}
            <button
              onClick={onTriggerGoodNews}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500 hover:to-orange-500 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold transition shadow flex items-center gap-1 active:scale-95"
              title="حاجة حلوة حصلت!"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="hidden sm:inline">فرحة 🎉</span>
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={onTriggerEmergency}
              className="px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 text-white text-xs font-black transition shadow-md shadow-red-900/40 flex items-center gap-1 animate-pulse active:scale-95"
              title="طوارئ SOS"
            >
              <AlertTriangle className="w-3.5 h-3.5 fill-current" />
              <span className="text-[10px] sm:text-xs">طوارئ</span>
            </button>
          </div>
        </div>

        {/* Desktop / Tablet Navigation Tabs */}
        <div className="hidden sm:block max-w-7xl mx-auto px-4 border-t border-white/5">
          <nav className="flex items-center gap-2 py-1.5 overflow-x-auto no-scrollbar">
            {/* 1. Notifications */}
            <button
              onClick={() => onTabChange('notifications')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap active:scale-95 ${
                activeTab === 'notifications'
                  ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BellRing className="w-3.5 h-3.5 text-rose-400" />
              <span>الإشعارات والمنبه</span>
            </button>

            {/* 2. Chat */}
            <button
              onClick={() => onTabChange('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap active:scale-95 ${
                activeTab === 'chat'
                  ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-pink-400" />
              <span>شات وريكوردات</span>
            </button>

            {/* 3. Love Meter */}
            <button
              onClick={() => onTabChange('love')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap active:scale-95 ${
                activeTab === 'love'
                  ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span className="flex items-center gap-1">
                مقياس الحب & الصناديق
                <span className="text-[10px] px-1.5 rounded-full bg-rose-500/40 text-rose-200">
                  {loveMeter}%
                </span>
              </span>
            </button>

            {/* 4. Milestones */}
            <button
              onClick={() => onTabChange('milestones')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap active:scale-95 ${
                activeTab === 'milestones'
                  ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>المناسبات والتواريخ</span>
            </button>

            {/* 5. Daily Questions */}
            <button
              onClick={() => onTabChange('questions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap active:scale-95 ${
                activeTab === 'questions'
                  ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
              <span>أسئلة مفاجئة</span>
            </button>

            {/* 6. GPS */}
            <button
              onClick={() => onTabChange('gps')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap active:scale-95 ${
                activeTab === 'gps'
                  ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-rose-400" />
              <span>المشاوير والـ GPS</span>
            </button>

            {/* 7. Settings / Edit All */}
            <button
              onClick={() => onTabChange('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap active:scale-95 ${
                activeTab === 'settings'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              <span>تعديل التطبيق ⚙️</span>
            </button>
          </nav>
        </div>
      </header>

      {/* DEDICATED MOBILE BOTTOM NAVIGATION DOCK (7 Tabs: Notifications, Chat, Love, Milestones, Questions, GPS, Settings) */}
      <nav
        aria-label="التنقل الرئيسي"
        className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 sm:hidden shadow-2xl safe-area-pb"
      >
        <div className="grid grid-cols-7 h-14 items-center px-0.5">
          {/* 1. Notifications */}
          <button
            onClick={() => onTabChange('notifications')}
            className={`flex flex-col items-center justify-center py-1 transition relative ${
              activeTab === 'notifications' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BellRing className={`w-4 h-4 ${activeTab === 'notifications' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[9px] mt-0.5">المنبه</span>
            {activeTab === 'notifications' && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-rose-500" />
            )}
          </button>

          {/* 2. Chat */}
          <button
            onClick={() => onTabChange('chat')}
            className={`flex flex-col items-center justify-center py-1 transition relative ${
              activeTab === 'chat' ? 'text-pink-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageCircle className={`w-4 h-4 ${activeTab === 'chat' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[9px] mt-0.5">الشات</span>
            {activeTab === 'chat' && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-pink-500" />
            )}
          </button>

          {/* 3. Love Meter */}
          <button
            onClick={() => onTabChange('love')}
            className={`flex flex-col items-center justify-center py-1 transition relative ${
              activeTab === 'love' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className={`w-4 h-4 ${activeTab === 'love' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[9px] mt-0.5">{loveMeter}%</span>
            {activeTab === 'love' && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-rose-500" />
            )}
          </button>

          {/* 4. Milestones */}
          <button
            onClick={() => onTabChange('milestones')}
            className={`flex flex-col items-center justify-center py-1 transition relative ${
              activeTab === 'milestones' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeTab === 'milestones' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[9px] mt-0.5">المناسبات</span>
            {activeTab === 'milestones' && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-purple-500" />
            )}
          </button>

          {/* 5. Questions */}
          <button
            onClick={() => onTabChange('questions')}
            className={`flex flex-col items-center justify-center py-1 transition relative ${
              activeTab === 'questions' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className={`w-4 h-4 ${activeTab === 'questions' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[9px] mt-0.5">الأسئلة</span>
            {activeTab === 'questions' && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-teal-500" />
            )}
          </button>

          {/* 6. GPS */}
          <button
            onClick={() => onTabChange('gps')}
            className={`flex flex-col items-center justify-center py-1 transition relative ${
              activeTab === 'gps' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className={`w-4 h-4 ${activeTab === 'gps' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[9px] mt-0.5">GPS</span>
            {activeTab === 'gps' && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-rose-500" />
            )}
          </button>

          {/* 7. Settings / Edit Everything */}
          <button
            onClick={() => onTabChange('settings')}
            className={`flex flex-col items-center justify-center py-1 transition relative ${
              activeTab === 'settings' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[9px] mt-0.5">تعديل ⚙️</span>
            {activeTab === 'settings' && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-purple-500" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
