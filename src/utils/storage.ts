import {
  UserProfile,
  UserLocation,
  ChatMessage,
  Milestone,
  DailyQuestion,
  EmergencyAlert,
  GoodNewsAlert,
  MysteryBoxReward,
  SpontaneousPing,
  ScheduledAlarm,
  CouplePairing,
} from '../types';

export const DEFAULT_USERS: Record<'hamoudi' | 'simo', UserProfile> = {
  hamoudi: {
    id: 'hamoudi',
    name: 'حمودي',
    nickname: 'روحي و سندي 🤍',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+201012345678',
    batteryLevel: 88,
    isCharging: false,
    status: 'بيفكر في سيمو 💭',
    lastSeen: 'نشط الآن',
  },
  simo: {
    id: 'simo',
    name: 'سيمو',
    nickname: 'حبيبتي وأميرتي 👑❤️',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    phone: '+201087654321',
    batteryLevel: 64,
    isCharging: true,
    status: 'في البيت بتستنى مكالمتك 🏠✨',
    lastSeen: 'نشطة الآن',
  },
};

export const DEFAULT_LOCATIONS: Record<'hamoudi' | 'simo', UserLocation> = {
  hamoudi: {
    userId: 'hamoudi',
    coords: { lat: 30.0444, lng: 31.2357 }, // Cairo Downtown / المعادي
    addressName: 'المعادي - شارع النصر',
    subArea: 'قريب من الكافيه المفضل ☕',
    speed: 'ثابت 📍',
    updatedAt: 'منذ دقيقتين',
    isLiveGps: false,
    battery: 88,
  },
  simo: {
    userId: 'simo',
    coords: { lat: 30.0626, lng: 31.2497 }, // Zamalek / Heliopolis
    addressName: 'مصر الجديدة - الكوربة',
    subArea: 'البيت بأمان 🌸',
    speed: 'ثابتة 🏠',
    updatedAt: 'الآن مباشر',
    isLiveGps: true,
    battery: 64,
  },
};

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'hamoudi',
    text: 'صباح الخير يا أجمل بنوتة في الكون، صحيتي ولا لسه؟ 🤍',
    timestamp: '09:15 ص',
    type: 'text',
  },
  {
    id: 'msg-2',
    senderId: 'simo',
    text: 'صباح النور يا حبيبي.. لسه صاحية وبفكر فيك، طمني وصلت الشغل بخير؟ 🥰',
    timestamp: '09:20 ص',
    type: 'text',
  },
  {
    id: 'msg-3',
    senderId: 'hamoudi',
    text: 'الحمد لله وصلت بالسلامة، فاتح تطبيق الأمان وشايفك منورة الخريطة في البيت 💖',
    timestamp: '09:25 ص',
    type: 'text',
  },
  {
    id: 'msg-4',
    senderId: 'simo',
    text: 'أنا مطمنة بوجودك يا سندي، متنساش تاكل وتشرب مياه! ✨',
    timestamp: '09:30 ص',
    type: 'text',
  },
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'm-1',
    title: 'أول نظرة وأول لقاء ☕✨',
    date: '2024-03-15',
    category: 'first_date',
    description: 'اليوم اللي حياتي كلها اتغيرت فيه وبدأت أحلى حكاية في دنيتي.',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'm-2',
    title: 'عيد ميلاد حبيبتي سيمو 🎂👑',
    date: '2025-11-20',
    category: 'birthday',
    description: 'أجمل يوم اتولدت فيه أميرة قلبي وروحي.',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'm-3',
    title: 'عيد ميلاد حمودي سندي 🎈🕺',
    date: '2025-08-14',
    category: 'birthday',
    description: 'اليوم اللي جه فيه راجلي وحبيبي وسندي في الدنيا.',
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'm-4',
    title: 'يوم خطوبتنا وعهد الأمان 💍🤍',
    date: '2024-10-10',
    category: 'engagement',
    description: 'اليوم اللي لبسنا فيه الدبل وكتبنا بداية وعد الأمان للأبد.',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
  },
];

export const INITIAL_QUESTIONS: DailyQuestion[] = [
  {
    id: 'q-today',
    question: 'إيه أكتر تصرف بيعمله التاني وبيحسسك بالأمان والحب حتى لو كنت مضغوط أو زعلان؟',
    dateStr: '2026-10-17',
    answers: {
      hamoudi: {
        text: 'لما تهمس في ودني وتقولي "أنا جنبك وفي ضهرك يا حمودي متقلقش من أي حاجة".. وقتها كل تعب الدنيا بيهون.',
        answeredAt: '10:30 ص',
      },
      simo: {
        text: 'لما بيمسك إيدي فجأة وإحنا بنعدي الشارع، ونظرة عيونه اللي مليانة خوف واهتمام بيا 🤍',
        answeredAt: '10:45 ص',
      },
    },
  },
  {
    id: 'q-yesterday',
    question: 'لو مسموح ليك تطلب أمنية واحدة ننفذها سوا في ويك إند واحد، تختار إيه؟',
    dateStr: '2026-10-16',
    answers: {
      hamoudi: {
        text: 'نسافر إسكندرية نقعد قدام البحر في الشتا ونشرب قهوة وناكل ذرة مشوي وإيدها في إيدي.',
        answeredAt: 'أمس 04:00 م',
      },
      simo: {
        text: 'نروح مدينة ملاهي نلعب ونضحك من قلبنا زي الأطفال وناكل غزل بنات سوا 🎠🎈',
        answeredAt: 'أمس 06:15 م',
      },
    },
  },
  {
    id: 'q-pool-1',
    question: 'إيه أول حاجة لفتت نظرك في التاني أول يوم شوفتوا بعض؟',
    dateStr: '2026-10-15',
    answers: {},
  },
  {
    id: 'q-pool-2',
    question: 'أكتر أكلة حمودي بيحب ياكلها من إيد سيمو، أو سيمو بتحب حمودي يعزمها عليها؟',
    dateStr: '2026-10-14',
    answers: {},
  },
  {
    id: 'q-pool-3',
    question: 'لو حبيبتك زعلانة منك تراضيها إزاي؟ وسيمو ترضى بإيه من حمودي؟',
    dateStr: '2026-10-13',
    answers: {},
  },
];

export const MYSTERY_REWARDS: MysteryBoxReward[] = [
  {
    id: 'r-1',
    title: 'رسالة: عهد الأمان ووطن قلبي 🤍🕊️',
    description:
      'حبيبتي وروحي سيمو.. تعرفي يعني إيه "الأمان"؟ الأمان يعني لما كل الدنيا تضيق وتقفل في وشي، مجرد ما أسمع نبرة صوتك أو أشوف لمعة عينك، روحي ترجعلي وتهدى من تاني. إنتِ مش بس حبيبتي، إنتِ دعوة أمي الصادقة في ليلة رضا اللي ربنا استجابها ليا وحطها في طريقي. بوعدك قدام ربنا هفضل في ضهرك، سندك، وحصنك اللي عمره ما هيتخلى عنك مهما حصل في الدنيا.. بحبك لأخر نبضة في قلبي يا كل ما ليا.',
    category: 'romantic_note',
    icon: '💌',
  },
  {
    id: 'r-2',
    title: 'رسالة: أنتِ الاستثناء الوحيد في عيني 👑✨',
    description:
      'إلى أميرتي وسيمو قلبي.. كل يوم بيعدي وإنتِ معايا بتأكد إن ربنا بيحبني أوي لما اختارك تكوني نصيبي. حنيتك عليا بتمسح أي تعب في ثانية، وطيبتك ونقاء قلبك مفيش زيهم في الكون. نظرة واحدة في عيونك بتديني طاقة أهد بيها جبال وأبني بيها قصور عشان أشوفك مبسوطة ومطمنة. ربنا يديمك نعمة في عمري وما يحرمني من وجودك اللي منور دنيتي كلها يا ست البنات.',
    category: 'romantic_note',
    icon: '✨',
  },
  {
    id: 'r-3',
    title: 'رسالة: وعد الأيام الجاية والبيت اللي بيجمعنا 💍🌸',
    description:
      'يا أغلى من روحي.. فاكرة أول نظرة وأول كلمة بينا؟ وقتها قلبي دق دقة عمري ما حسيتها قبلك، وعرفت ساعتها إن كل اللي فات كان تمهيد عشان ألاقيكي. مستني اليوم اللي يتقفل علينا فيه باب بيت واحد، نسهر سوا، ونصحى على وش بعض، وكل خطوة بنمشيها سوا بتقربنا لأجمل حلم. خليكي واثقة إن قلبي وعيني مقفولين عليكي ومش شايفين غيرك في كل الدنيا.',
    category: 'romantic_note',
    icon: '💍',
  },
  {
    id: 'r-4',
    title: 'رسالة: سر السكينة وراحة الروح 🥺❤️',
    description:
      'حمودي وسيمو.. لما بسمع أسامينا سوا، بحس بدفا وراحة ملهاش نهاية. إنتِ مش بس شريكة، إنتِ سري الصغير، وملجأي من كل زعل الدنيا. لو كل العالم وقف في كفة وإنتِ ماسكة إيدي في الكفة التانية، هفضل كسبان ومطمن. شكراً عشان إنتِ أحن وأصدق إنسانة في حياتي، وبقولهالك من نص قلبي: أنا واقع في غرامك كل يوم أكتر من اليوم اللي قبله.',
    category: 'romantic_note',
    icon: '💖',
  },
  {
    id: 'r-5',
    title: 'قسيمة الدلال الملكي المطلق! 👑🍰',
    description:
      'قسيمة حب استثنائية غير قابلة للإلغاء: ليكي يوم كامل طلباتك فيه كلها أوامر! ممنوع فيه أي كلمة "لا"، وممنوع أي زعل نهائياً. عزومة في مطعمك المفضل مع الحلو، ومفاجأة خاصة جداً مستنياكي مع باقة ورد.',
    category: 'voucher',
    icon: '🍽️',
  },
  {
    id: 'r-6',
    title: 'بطاقة "سمعاً وطاعة" الفورية 📜🤍',
    description:
      'حق ملكي لاستخدام بطاقة الطاعة والتدليل: أي رغبة أو طلب يطلبه صاحب الصندوق يتنفذ فوراً بدون أي نقاش أو جدال وبابتسامة عريضة!',
    category: 'wish',
    icon: '📜',
  },
];

export const INITIAL_SCHEDULED_ALARMS: ScheduledAlarm[] = [
  {
    id: 'alarm-1',
    senderId: 'hamoudi',
    title: 'منبه عشوائي مفاجئ: افتكرتك ودعيتلك 🤍',
    message: 'تنبيه حب غير محدد الموعد فاجئك في نص اليوم عشان يقولك إنك في بالي على طول ✨',
    alarmType: 'random_window',
    timeFrom: '13:00',
    timeTo: '17:00',
    exactTime: '15:15',
    scheduledForText: 'موعد غير محدد: عشوائي بين الساعة 01:00 م والساعة 05:00 م',
    active: true,
    category: 'love',
    createdAt: 'اليوم',
  },
  {
    id: 'alarm-2',
    senderId: 'simo',
    title: 'منبه شرب المياه والاهتمام 🥤🌸',
    message: 'تنبيه رعاية: متنساش تشرب مياه وتاكل وتطمني عنك يا قلبي!',
    alarmType: 'exact_time',
    exactTime: '21:30',
    scheduledForText: 'الساعة 09:30 مساءً (يتكرر يومياً)',
    active: true,
    repeatDaily: true,
    category: 'care',
    createdAt: 'اليوم',
  },
];

export const INITIAL_PAIRING: CouplePairing = {
  pairCode: 'AMAN-HAMOUDI-SIMO-77',
  isPaired: true,
  pairedAt: '2024-03-15',
  myRole: 'hamoudi',
  partnerName: 'سيمو',
};


export const SPONTANEOUS_PINGS_SUGGESTIONS = [
  {
    title: 'افتكرتك فجأة ودعيتلك 🤍',
    message: 'جيتي في بالي فجأة ودعيت ربنا يحفظك ليا ويفرح قلبك يا كل ما ليا ✨',
    type: 'love_ping' as const,
  },
  {
    title: 'اشرب مياه يا قلبي 🥤',
    message: 'تذكير حب فوري: بطلي كسل واشربي مياه دلوقتي حالاً عشان صحتك تهمني!',
    type: 'water' as const,
  },
  {
    title: 'ابتسم عشان ضحكتك بتنورني 🌸',
    message: 'حتى وإحنا بعاد عن بعض، افتكر إن في حد بيحبك لآخر الدنيا ومستني ضحكتك.',
    type: 'smile' as const,
  },
  {
    title: 'حضن دافي عن بُعد 🫂❤️',
    message: 'ببعتلك حضن افتراضي دافي يطمن قلبك ويشيل أي تعب أو ضغط حاسس بيه.',
    type: 'hug' as const,
  },
];

export const INITIAL_PINGS: SpontaneousPing[] = [
  {
    id: 'ping-1',
    senderId: 'hamoudi',
    title: 'افتكرتك فجأة ودعيتلك 🤍',
    message: 'جيتي في بالي فجأة ودعيت ربنا يحفظك ليا ويفرح قلبك يا كل ما ليا ✨',
    type: 'love_ping',
    timestamp: 'منذ 15 دقيقة',
  },
  {
    id: 'ping-2',
    senderId: 'simo',
    title: 'اشرب مياه يا قلبي 🥤',
    message: 'تذكير حب فوري: بطلي كسل واشرب مياه دلوقتي عشان صحتك تهمني!',
    type: 'water',
    timestamp: 'منذ 35 دقيقة',
  },
  {
    id: 'ping-3',
    senderId: 'hamoudi',
    title: 'أنا وصلت بالسلامة 🚗',
    message: 'الحمد لله وصلت المعادي وبخير ومطمن عليكي 🌸',
    type: 'love_ping',
    timestamp: 'منذ ساعة',
  },
];

// Helper to broadcast changes across open tabs
let broadcastChannel: BroadcastChannel | null = null;
try {
  broadcastChannel = new BroadcastChannel('el_aman_couples_channel');
} catch (e) {
  console.warn('BroadcastChannel not supported in this environment');
}

export function broadcastAppEvent(type: string, payload: unknown) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload });
    } catch (e) {
      console.warn('Broadcast postMessage failed:', e);
    }
  }
}

export function subscribeToAppEvents(callback: (type: string, payload: unknown) => void) {
  if (!broadcastChannel) return () => {};
  const handler = (event: MessageEvent) => {
    if (event.data && event.data.type) {
      callback(event.data.type, event.data.payload);
    }
  };
  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel?.removeEventListener('message', handler);
  };
}
