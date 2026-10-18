export type UserId = 'hamoudi' | 'simo';

export interface UserProfile {
  id: UserId;
  name: string; // e.g. "حمودي" / "سيمو"
  nickname: string; // e.g. "روحي" / "حبيبتي"
  avatar: string;
  phone: string;
  batteryLevel: number;
  isCharging: boolean;
  status: string; // "في البيت 🏠", "في الشارع 🚗", "بيفكر فيك 💭", "في الشغل 💼"
  lastSeen: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserLocation {
  userId: UserId;
  coords: Coordinates;
  addressName: string;
  subArea: string;
  speed: string; // "ثابت", "يمشي 4 كم/س", "بالسيارة 45 كم/س"
  updatedAt: string;
  isLiveGps: boolean;
  battery: number;
}

export interface ChatMessage {
  id: string;
  senderId: UserId;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  audioDuration?: number; // in seconds
  timestamp: string;
  type: 'text' | 'image' | 'audio' | 'sticker' | 'system';
}

export interface Milestone {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'birthday' | 'anniversary' | 'first_date' | 'engagement' | 'wedding' | 'custom';
  description?: string;
  imageUrl?: string;
}

export interface DailyQuestion {
  id: string;
  question: string;
  dateStr: string; // YYYY-MM-DD
  addedBy?: UserId;
  answers: {
    hamoudi?: { text: string; answeredAt: string };
    simo?: { text: string; answeredAt: string };
  };
}

export interface EmergencyAlert {
  active: boolean;
  triggeredBy: UserId;
  timestamp: string;
  locationName: string;
  coords: Coordinates;
  message?: string;
}

export interface GoodNewsAlert {
  active: boolean;
  triggeredBy: UserId;
  timestamp: string;
  title: string;
  message: string;
  category: 'joy' | 'success' | 'surprise' | 'love';
}

export interface MysteryBoxReward {
  id: string;
  title: string;
  description: string;
  category: 'voucher' | 'romantic_note' | 'wish' | 'date';
  icon: string;
}

export interface SpontaneousPing {
  id: string;
  senderId: UserId;
  title: string;
  message: string;
  type: 'love_ping' | 'water' | 'smile' | 'hug' | 'mystery_alarm';
  timestamp: string;
}

export interface ScheduledAlarm {
  id: string;
  senderId: UserId;
  title: string;
  message: string;
  alarmType: 'exact_time' | 'random_window' | 'multiple_times' | 'recurring_random';
  exactTime?: string; // HH:mm e.g. "15:30"
  timeFrom?: string; // HH:mm e.g. "13:00"
  timeTo?: string; // HH:mm e.g. "17:00"
  targetTimestamp?: number; // epoch timestamp
  scheduledForText: string;
  active: boolean;
  repeatDaily?: boolean;
  category: 'love' | 'care' | 'joke' | 'surprise';
  createdAt: string;
}

export interface CouplePairing {
  pairCode: string;
  isPaired: boolean;
  pairedAt: string;
  myRole: UserId;
  partnerName: string;
}

export interface AppSettings {
  relationshipStartDate: string;
  appTitle: string;
  subtitle: string;
  lockDeviceRole: boolean;
  notifyWhenPartnerOpens: boolean;
}


