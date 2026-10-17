import React, { useEffect } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  MapPin,
  Shield,
  VolumeX,
  Volume2,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import { EmergencyAlert, UserProfile } from '../types';
import { playEmergencySiren, stopEmergencySiren } from '../utils/audio';

interface EmergencyModalProps {
  alert: EmergencyAlert;
  senderProfile: UserProfile;
  onDismiss: () => void;
  onCall: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  alert,
  senderProfile,
  onDismiss,
  onCall,
}) => {
  useEffect(() => {
    // Play loud siren when alert opens
    playEmergencySiren();
    return () => {
      stopEmergencySiren();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Red flashing border overlay */}
      <div className="absolute inset-0 border-8 border-red-600/80 animate-pulse pointer-events-none" />

      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-red-950 via-slate-950 to-red-950 border-2 border-red-500 p-6 sm:p-8 shadow-2xl shadow-red-600/50 text-center space-y-6 animate-in zoom-in-95 duration-300">
        {/* Pulsing Alarm Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-red-600/40 animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-red-600 border-4 border-red-400 flex items-center justify-center text-white shadow-2xl shadow-red-600/60">
            <AlertTriangle className="w-12 h-12 animate-bounce" />
          </div>
        </div>

        {/* Alarm Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-red-600 text-white text-xs font-black tracking-wider animate-pulse">
            🚨 نداء استغاثة وطوارئ عاجل!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {senderProfile.name} في حالة طوارئ وتحتاجك الآن!
          </h2>
          <p className="text-sm text-red-200">
            تم ضغط زر الأمان والطوارئ في تطبيق "الامان". يرن التطبيق الآن لتنبيهك فوراً!
          </p>
        </div>

        {/* Location Box */}
        <div className="rounded-2xl bg-black/50 border border-red-500/40 p-4 text-right space-y-2">
          <div className="flex items-center justify-between text-xs text-red-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-red-400" />
              الموقع الدقيق وقت طلب الطوارئ:
            </span>
            <span>{alert.timestamp}</span>
          </div>
          <p className="text-base font-bold text-white">{alert.locationName}</p>
          {alert.message && (
            <p className="text-xs text-red-200 bg-red-900/30 p-2 rounded-xl border border-red-500/20">
              رسالة مرفقة: "{alert.message}"
            </p>
          )}
        </div>

        {/* Direct Call Button */}
        <div className="space-y-3">
          <button
            onClick={onCall}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-lg transition shadow-xl shadow-emerald-900/50 flex items-center justify-center gap-3 animate-pulse"
          >
            <PhoneCall className="w-6 h-6 fill-current" />
            اتصال فوري بـ {senderProfile.name} ({senderProfile.phone})
          </button>

          <button
            onClick={() => {
              stopEmergencySiren();
              onDismiss();
            }}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition border border-white/10 flex items-center justify-center gap-2"
          >
            <VolumeX className="w-4 h-4" />
            إيقاف صوت الإنذار وطمأنة الطرف الآخر (أنا بخير)
          </button>
        </div>
      </div>
    </div>
  );
};
