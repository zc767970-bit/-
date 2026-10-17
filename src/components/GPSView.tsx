import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Battery,
  BatteryCharging,
  MapPin,
  RefreshCw,
  PhoneCall,
  ShieldCheck,
  Send,
  Compass,
  Layers,
  Heart,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { UserLocation, UserProfile, UserId } from '../types';

interface GPSViewProps {
  currentUserId: UserId;
  currentUser: UserProfile;
  partnerUser: UserProfile;
  myLocation: UserLocation;
  partnerLocation: UserLocation;
  onUpdateMyLocation: (newLoc: Partial<UserLocation>) => void;
  onSendSafeArrival: () => void;
  onRequestCall: () => void;
}

// Calculate distance between two lat/lng points in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const GPSView: React.FC<GPSViewProps> = ({
  currentUserId,
  currentUser,
  partnerUser,
  myLocation,
  partnerLocation,
  onUpdateMyLocation,
  onSendSafeArrival,
  onRequestCall,
}) => {
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapStyle, setMapStyle] = useState<'night' | 'satellite'>('night');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const distanceKm = calculateDistance(
    myLocation.coords.lat,
    myLocation.coords.lng,
    partnerLocation.coords.lat,
    partnerLocation.coords.lng
  );

  const approxDrivingTime = Math.max(3, Math.round(distanceKm * 2.2));

  // Try real browser GPS when user clicks update
  const handleGetRealGps = () => {
    if (!navigator.geolocation) {
      setGpsError('متصفحك لا يدعم تحديد الموقع المباشر');
      return;
    }
    setIsGettingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGettingGps(false);
        onUpdateMyLocation({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          addressName: 'موقعي الفعلي الحالي (GPS دقيق)',
          subArea: `دقة التحديد: ±${Math.round(pos.coords.accuracy)} متر`,
          speed: pos.coords.speed ? `${Math.round(pos.coords.speed * 3.6)} كم/س` : 'ثابت 📍',
          updatedAt: 'الآن مباشر',
          isLiveGps: true,
        });
      },
      (err) => {
        setIsGettingGps(false);
        setGpsError('تعذر الحصول على إذن الموقع، تأكد من تفعيل الـ GPS في جهازك');
        console.warn('GPS error:', err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Quick preset spots for realistic romance tracking
  const presetLocations = [
    { name: 'البيت في غرفتي 🏠', sub: 'مرتاحة وبأمان تام', lat: 30.0626, lng: 31.2497, speed: 'ثابت في البيت' },
    { name: 'كافيه هادي مع الأصحاب ☕', sub: 'في جلسة لطيفة', lat: 30.0444, lng: 31.2357, speed: 'جالس في كافيه' },
    { name: 'في الطريق بالسيارة 🚗', sub: 'في طريقي للبيت', lat: 30.055, lng: 31.275, speed: 'بالسيارة 45 كم/س' },
    { name: 'الشغل / الجامعة 💼', sub: 'موجود في مكتبي', lat: 30.078, lng: 31.312, speed: 'في الدوام' },
    { name: 'المول وشراء طلبات 🛍️', sub: 'قريب من المتاجر', lat: 30.033, lng: 31.215, speed: 'يمشي 4 كم/س' },
  ];

  const handleSelectPreset = (preset: typeof presetLocations[0]) => {
    onUpdateMyLocation({
      coords: { lat: preset.lat, lng: preset.lng },
      addressName: preset.name,
      subArea: preset.sub,
      speed: preset.speed,
      updatedAt: 'الآن',
      isLiveGps: false,
    });
    setShowLocationPicker(false);
  };

  const openInGoogleMaps = (coords: { lat: number; lng: number }) => {
    const url = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Partner Safety Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-purple-950/70 border border-rose-500/30 p-5 shadow-2xl backdrop-blur-xl">
        <div className="absolute -left-12 -top-12 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={partnerUser.avatar}
                alt={partnerUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-400/80 shadow-lg shadow-rose-500/20"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-1.5">
                  مكان {partnerUser.name} الآن
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                  {partnerLocation.updatedAt}
                </span>
              </div>
              <p className="text-rose-200 font-semibold text-base mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                {partnerLocation.addressName}
              </p>
              <p className="text-xs text-slate-300 mt-0.5">{partnerLocation.subArea} • {partnerLocation.speed}</p>
            </div>
          </div>

          {/* Quick Metrics & Call */}
          <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            {/* Battery */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs">
              {partnerUser.isCharging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <Battery className="w-4 h-4 text-amber-400" />
              )}
              <span className="font-bold text-slate-200">{partnerLocation.battery}%</span>
              <span className="text-slate-400 text-[10px]">بطارية {partnerUser.name}</span>
            </div>

            {/* Distance */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200">
              <Navigation className="w-4 h-4 text-rose-400 rotate-45" />
              <span className="font-bold text-white">{distanceKm} كم</span>
              <span className="text-rose-300/80 text-[10px]">({approxDrivingTime} دقيقة بالسيارة)</span>
            </div>

            {/* Call button */}
            <button
              onClick={onRequestCall}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-900/30"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              اطمن برنة
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Stage */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-2xl h-[400px] sm:h-[480px]">
        {/* Map Grid / Styled Vector Canvas simulation */}
        <div
          className={`absolute inset-0 transition-all duration-700 ${
            mapStyle === 'night'
              ? 'bg-gradient-to-br from-slate-950 via-[#0d1527] to-[#070b14]'
              : 'bg-gradient-to-br from-[#121c2e] via-[#1a2942] to-[#0f172a]'
          }`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.08) 0%, transparent 60%),
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
            transform: `scale(${mapZoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Simulated Roads & Landmarks */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <path
              d="M-50,220 Q200,180 400,260 T800,210"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="opacity-50"
            />
            <path
              d="M150,-50 Q280,240 350,550"
              fill="none"
              stroke="#64748b"
              strokeWidth="5"
              className="opacity-40"
            />
            <path
              d="M50,450 Q300,320 600,380"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 8"
              className="opacity-60"
            />
          </svg>

          {/* Connection Arc Line between Hamoudi & Simo */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <linearGradient id="loveBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path
              d="M 28% 40% Q 50% 25% 72% 58%"
              fill="none"
              stroke="url(#loveBeam)"
              strokeWidth="3.5"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
            {/* Center Heart Indicator on Path */}
            <circle cx="50%" cy="32%" r="14" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
            <text x="50%" y="35%" textAnchor="middle" fill="#f43f5e" fontSize="13">
              ❤️
            </text>
          </svg>

          {/* Partner Pin (Simo or partner) */}
          <div
            className="absolute z-20 transition-all duration-700"
            style={{
              top: '40%',
              left: '28%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative flex flex-col items-center group cursor-pointer">
              {/* Radar pulse rings */}
              <div className="absolute -inset-4 rounded-full bg-rose-500/30 animate-radar pointer-events-none" />
              <div className="absolute -inset-8 rounded-full bg-pink-500/20 animate-radar delay-300 pointer-events-none" />

              {/* Pin bubble */}
              <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 shadow-xl shadow-rose-600/40 ring-4 ring-rose-400/40">
                <img
                  src={partnerUser.avatar}
                  alt={partnerUser.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-white/20 shadow">
                  {partnerUser.name}
                </span>
              </div>

              {/* Pin stick */}
              <div className="w-1 h-4 bg-gradient-to-b from-rose-500 to-transparent" />

              {/* Location Tag */}
              <div className="mt-1 px-3 py-1 rounded-xl bg-slate-900/90 border border-rose-500/40 text-[11px] font-semibold text-rose-200 shadow-lg text-center backdrop-blur-md">
                <span className="block text-white font-bold">{partnerLocation.addressName}</span>
                <span className="text-[10px] text-slate-400">{partnerLocation.subArea || partnerUser.status || 'أمان تام 🤍'}</span>
              </div>
            </div>
          </div>

          {/* My Pin (CurrentUser) */}
          <div
            className="absolute z-20 transition-all duration-700"
            style={{
              top: '58%',
              left: '72%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative flex flex-col items-center group cursor-pointer">
              {/* Radar pulse ring */}
              <div className="absolute -inset-3 rounded-full bg-sky-500/30 animate-radar pointer-events-none" />

              {/* Pin bubble */}
              <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 shadow-xl shadow-sky-600/40 ring-4 ring-sky-400/40">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <span className="absolute -top-2 -right-2 bg-sky-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-white/20 shadow">
                  أنا ({currentUser.name})
                </span>
              </div>

              {/* Pin stick */}
              <div className="w-1 h-3 bg-gradient-to-b from-sky-500 to-transparent" />

              {/* Location Tag */}
              <div className="mt-1 px-3 py-1 rounded-xl bg-slate-900/90 border border-sky-500/40 text-[11px] font-semibold text-sky-200 shadow-lg text-center backdrop-blur-md">
                <span className="block text-white font-bold">{myLocation.addressName}</span>
                <span className="text-[10px] text-slate-400">{myLocation.speed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Top-Right Overlay Controls */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
          {/* Zoom controls */}
          <div className="flex flex-col bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-1 shadow-lg">
            <button
              onClick={() => setMapZoom((z) => Math.min(1.4, z + 0.1))}
              className="w-8 h-8 flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 rounded-xl text-lg font-bold"
              title="تكبير"
            >
              +
            </button>
            <div className="h-px bg-white/10 my-0.5" />
            <button
              onClick={() => setMapZoom((z) => Math.max(0.8, z - 0.1))}
              className="w-8 h-8 flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 rounded-xl text-lg font-bold"
              title="تصغير"
            >
              -
            </button>
          </div>

          {/* Style toggle */}
          <button
            onClick={() => setMapStyle((s) => (s === 'night' ? 'satellite' : 'night'))}
            className="w-8 h-8 flex items-center justify-center bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl text-slate-300 hover:text-white shadow-lg"
            title="تبديل النمط"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Map Bottom-Center Distance Badge */}
        <div className="absolute bottom-4 inset-x-0 mx-auto w-fit z-30 px-4 py-2 rounded-full bg-slate-950/85 border border-rose-500/30 backdrop-blur-xl shadow-2xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300">
            المسافة الحالية بينكما: <strong className="text-rose-400">{distanceKm} كم</strong>
          </span>
          <div className="h-3 w-px bg-white/20" />
          <button
            onClick={() => openInGoogleMaps(partnerLocation.coords)}
            className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
          >
            فتح خريطة Google
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Action Bars for Updating & Reassurance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Safe Arrival Button */}
        <button
          onClick={onSendSafeArrival}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600/30 via-emerald-600/20 to-slate-900 border border-emerald-500/40 p-4 text-right transition hover:border-emerald-400 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
              بنقرة واحدة 🚗
            </span>
          </div>
          <div className="mt-3">
            <h4 className="font-bold text-white text-base">أنا وصلت بالسلامة يا حبيبي!</h4>
            <p className="text-xs text-slate-300 mt-1">
              يبعت إشعار فوري لـ {partnerUser.name} يطمنها إنك وصلت مكانك بأمان تام بدون ما تسأل.
            </p>
          </div>
        </button>

        {/* Update My Location / Live GPS */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">موقعي المسجل لـ {partnerUser.name}:</span>
            <span className="text-xs font-semibold text-sky-300 bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-500/30">
              {myLocation.addressName}
            </span>
          </div>

          {gpsError && (
            <p className="text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 mt-2">
              {gpsError}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={handleGetRealGps}
              disabled={isGettingGps}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs transition shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGettingGps ? 'animate-spin' : ''}`} />
              {isGettingGps ? 'جاري الرصد...' : 'تحديث GPS الفعلي'}
            </button>

            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-white/10"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              تغيير المكان يدوياً
            </button>
          </div>
        </div>
      </div>

      {/* Preset Location Picker Drawer */}
      {showLocationPicker && (
        <div className="rounded-2xl bg-slate-900 border border-rose-500/30 p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-bold text-white text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-rose-400" />
              اختر مكانك الحالي ليظهر لـ {partnerUser.name} فوراً:
            </h5>
            <button
              onClick={() => setShowLocationPicker(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {presetLocations.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="text-right p-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 hover:border-rose-500/40 border border-white/5 transition group"
              >
                <p className="font-bold text-white text-xs group-hover:text-rose-300 transition">
                  {preset.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{preset.sub}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
