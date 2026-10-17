import React, { useState, useEffect } from 'react';
import {
  DEFAULT_USERS,
  DEFAULT_LOCATIONS,
  INITIAL_MESSAGES,
  INITIAL_MILESTONES,
  INITIAL_QUESTIONS,
  INITIAL_PINGS,
  INITIAL_SCHEDULED_ALARMS,
  INITIAL_PAIRING,
  MYSTERY_REWARDS,
  broadcastAppEvent,
  subscribeToAppEvents,
} from './utils/storage';
import {
  UserId,
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
} from './types';
import { Navbar, AppTabType } from './components/Navbar';
import { NotificationsView } from './components/NotificationsView';
import { GPSView } from './components/GPSView';
import { ChatView } from './components/ChatView';
import { LoveMeterView } from './components/LoveMeterView';
import { MilestonesView } from './components/MilestonesView';
import { QuestionsView } from './components/QuestionsView';
import { EmergencyModal } from './components/EmergencyModal';
import { GoodNewsModal } from './components/GoodNewsModal';
import { SpontaneousPingsModal } from './components/SpontaneousPingsModal';
import { playLovePingSound, playGoodNewsChime, playMessageSound } from './utils/audio';
import { PhoneCall, Heart, BellRing, Sparkles, X, ShieldAlert } from 'lucide-react';

export default function App() {
  // Profiles
  const [users, setUsers] = useState<Record<UserId, UserProfile>>(() => {
    const saved = localStorage.getItem('el_aman_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });
  const [currentUserId, setCurrentUserId] = useState<UserId>('hamoudi');

  // Navigation tab: Starts with 'notifications' first as requested by the user!
  const [activeTab, setActiveTab] = useState<AppTabType>('notifications');

  // Locations
  const [locations, setLocations] = useState<Record<UserId, UserLocation>>(() => {
    const saved = localStorage.getItem('el_aman_locations');
    return saved ? JSON.parse(saved) : DEFAULT_LOCATIONS;
  });

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('el_aman_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Pings & Alarms History
  const [pingsHistory, setPingsHistory] = useState<SpontaneousPing[]>(() => {
    const saved = localStorage.getItem('el_aman_pings_history');
    return saved ? JSON.parse(saved) : INITIAL_PINGS;
  });

  // Scheduled & Non-specified Alarms by Clock Time
  const [scheduledAlarms, setScheduledAlarms] = useState<ScheduledAlarm[]>(() => {
    const saved = localStorage.getItem('el_aman_scheduled_alarms');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_ALARMS;
  });

  // Couple Pairing state (permanent link)
  const [pairing, setPairing] = useState<CouplePairing>(() => {
    const saved = localStorage.getItem('el_aman_pairing');
    return saved ? JSON.parse(saved) : INITIAL_PAIRING;
  });

  // Love meter
  const [loveMeter, setLoveMeter] = useState<number>(() => {
    const saved = localStorage.getItem('el_aman_love_meter');
    return saved ? JSON.parse(saved) : 85;
  });

  // Milestones
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('el_aman_milestones');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
  });

  // Daily Questions
  const [questions, setQuestions] = useState<DailyQuestion[]>(() => {
    const saved = localStorage.getItem('el_aman_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  // Mystery Box Rewards (contains deeply romantic letters)
  const [mysteryRewards, setMysteryRewards] = useState<MysteryBoxReward[]>(() => {
    const saved = localStorage.getItem('el_aman_rewards');
    return saved ? JSON.parse(saved) : MYSTERY_REWARDS;
  });

  // Alerts & Modals
  const [emergencyAlert, setEmergencyAlert] = useState<EmergencyAlert | null>(null);
  const [goodNewsAlert, setGoodNewsAlert] = useState<GoodNewsAlert | null>(null);
  const [showSpontaneousModal, setShowSpontaneousModal] = useState(false);
  const [showGoodNewsPicker, setShowGoodNewsPicker] = useState(false);
  const [activeCallModal, setActiveCallModal] = useState<UserProfile | null>(null);

  // In-app banner toasts
  const [toastNotification, setToastNotification] = useState<{
    id: string;
    title: string;
    message: string;
    icon?: string;
  } | null>(null);

  const currentUser = users[currentUserId];
  const partnerUserId: UserId = currentUserId === 'hamoudi' ? 'simo' : 'hamoudi';
  const partnerUser = users[partnerUserId];
  const myLocation = locations[currentUserId];
  const partnerLocation = locations[partnerUserId];

  // Auto-pair if URL contains ?pair=...&partner=simo
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pairCode = params.get('pair');
    const partnerRole = params.get('partner');
    if (pairCode) {
      setPairing((prev) => ({
        ...prev,
        pairCode,
        isPaired: true,
      }));
      if (partnerRole === 'simo') {
        setCurrentUserId('simo');
      }
      showToast('🎉 تم ربط التطبيق بحبيبتك بنجاح للأبد!', `أنت الآن متصل بكود الأمان: ${pairCode}`);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('el_aman_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('el_aman_locations', JSON.stringify(locations));
  }, [locations]);
  useEffect(() => {
    localStorage.setItem('el_aman_messages', JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem('el_aman_pings_history', JSON.stringify(pingsHistory));
  }, [pingsHistory]);
  useEffect(() => {
    localStorage.setItem('el_aman_scheduled_alarms', JSON.stringify(scheduledAlarms));
  }, [scheduledAlarms]);
  useEffect(() => {
    localStorage.setItem('el_aman_pairing', JSON.stringify(pairing));
  }, [pairing]);
  useEffect(() => {
    localStorage.setItem('el_aman_love_meter', JSON.stringify(loveMeter));
  }, [loveMeter]);
  useEffect(() => {
    localStorage.setItem('el_aman_milestones', JSON.stringify(milestones));
  }, [milestones]);
  useEffect(() => {
    localStorage.setItem('el_aman_questions', JSON.stringify(questions));
  }, [questions]);
  useEffect(() => {
    localStorage.setItem('el_aman_rewards', JSON.stringify(mysteryRewards));
  }, [mysteryRewards]);

  // Background timer checker for clock-time scheduled alarms
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      scheduledAlarms.forEach((alarm) => {
        if (alarm.active && alarm.targetTimestamp && now >= alarm.targetTimestamp) {
          // Trigger the alarm!
          playLovePingSound();
          const ping: SpontaneousPing = {
            id: `ping-${Date.now()}`,
            senderId: alarm.senderId,
            title: `🔔 حان موعد منبه: ${alarm.title}`,
            message: alarm.message,
            type: 'mystery_alarm',
            timestamp: 'الآن',
          };
          setPingsHistory((prev) => [ping, ...prev]);
          broadcastAppEvent('SPONTANEOUS_PING', ping);
          showToast(`🔔 رنة منبه الحب: ${alarm.title}`, alarm.message, '⏰');

          // Reset target for tomorrow or mark fired
          setScheduledAlarms((prev) =>
            prev.map((a) =>
              a.id === alarm.id
                ? {
                    ...a,
                    targetTimestamp: a.repeatDaily ? Date.now() + 24 * 60 * 60 * 1000 : undefined,
                    active: Boolean(a.repeatDaily),
                  }
                : a
            )
          );
        }
      });
    }, 15000); // checks every 15s

    return () => clearInterval(interval);
  }, [scheduledAlarms]);

  // Subscribe to multi-tab broadcast events for live dual-device feel
  useEffect(() => {
    const unsubscribe = subscribeToAppEvents((type, payload: any) => {
      if (type === 'EMERGENCY_TRIGGERED') {
        setEmergencyAlert(payload);
      } else if (type === 'EMERGENCY_DISMISSED') {
        setEmergencyAlert(null);
      } else if (type === 'GOOD_NEWS_TRIGGERED') {
        setGoodNewsAlert(payload);
      } else if (type === 'SPONTANEOUS_PING') {
        playLovePingSound();
        showToast(payload.title, payload.message);
        setPingsHistory((prev) => [payload, ...prev]);
      } else if (type === 'NEW_CHAT_MESSAGE') {
        setMessages((prev) => [...prev, payload]);
        playMessageSound();
      } else if (type === 'LOCATION_UPDATED') {
        setLocations((prev) => ({
          ...prev,
          [payload.userId]: payload,
        }));
      } else if (type === 'QUESTION_ANSWERED') {
        setQuestions((prev) =>
          prev.map((q) => (q.id === payload.questionId ? { ...q, answers: payload.answers } : q))
        );
        showToast(
          `💌 ${payload.answeredByName} جاوب ع السؤال!`,
          `"${payload.answerText.slice(0, 50)}..."`
        );
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = (title: string, message: string, icon = '💌') => {
    const id = Date.now().toString();
    setToastNotification({ id, title, message, icon });
    setTimeout(() => {
      setToastNotification((curr) => (curr?.id === id ? null : curr));
    }, 6500);
  };

  // Location update
  const handleUpdateMyLocation = (newLoc: Partial<UserLocation>) => {
    const updated: UserLocation = {
      ...myLocation,
      ...newLoc,
      userId: currentUserId,
    };
    setLocations((prev) => ({
      ...prev,
      [currentUserId]: updated,
    }));
    broadcastAppEvent('LOCATION_UPDATED', updated);
    showToast('تم تحديث موقعك بنجاح 📍', `يظهر الآن لـ ${partnerUser.name}: ${updated.addressName}`);
  };

  // Safe arrival
  const handleSendSafeArrival = () => {
    const textMsg = `الحمد لله أنا وصلت ${myLocation.addressName} بالسلامة وبخير يا روحي! 🚗🤍`;
    const arrivalMessage: ChatMessage = {
      id: `arrival-${Date.now()}`,
      senderId: currentUserId,
      type: 'text',
      text: textMsg,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, arrivalMessage]);
    broadcastAppEvent('NEW_CHAT_MESSAGE', arrivalMessage);

    const ping: SpontaneousPing = {
      id: `ping-${Date.now()}`,
      senderId: currentUserId,
      title: `🚗 ${currentUser.name} وصل بالسلامة!`,
      message: textMsg,
      type: 'love_ping',
      timestamp: 'الآن',
    };
    setPingsHistory((prev) => [ping, ...prev]);
    broadcastAppEvent('SPONTANEOUS_PING', ping);
    playGoodNewsChime();
    showToast('تم إرسال إشعار الوصول بالسلامة 🚗✨', `اطمئنت ${partnerUser.name} عليك فوراً!`);
    handleIncreaseLoveMeter(6, 'إشعار وصول آمن');
  };

  // Chat message sending
  const handleSendMessage = (msgData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    broadcastAppEvent('NEW_CHAT_MESSAGE', newMsg);
    handleIncreaseLoveMeter(3, 'رسالة شات');
  };

  // Love meter boost
  const handleIncreaseLoveMeter = (amount: number, reason: string) => {
    setLoveMeter((prev) => {
      const next = Math.min(100, prev + amount);
      if (next >= 100 && prev < 100) {
        showToast('🎉 تهانينا! مؤشر الحب وصل 100%!', 'تم فتح صناديق الرسائل الغرامية الأربعة الآن!');
      }
      return next;
    });
  };

  // Love ping
  const handleSendLoveHeart = () => {
    playLovePingSound();
    const ping: SpontaneousPing = {
      id: `ping-${Date.now()}`,
      senderId: currentUserId,
      title: `❤️ نبضة حب عاجلة من ${currentUser.name}!`,
      message: `بفكر فيكي في كل لحظة، وببعتلك كل حبي وأماني يا أغلى ما عندي ✨`,
      type: 'love_ping',
      timestamp: 'الآن',
    };
    setPingsHistory((prev) => [ping, ...prev]);
    broadcastAppEvent('SPONTANEOUS_PING', ping);
    showToast(ping.title, ping.message, '❤️');
    handleIncreaseLoveMeter(5, 'نبضة حب');
  };

  // Emergency SOS trigger
  const handleTriggerEmergency = () => {
    const alert: EmergencyAlert = {
      active: true,
      triggeredBy: currentUserId,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      locationName: myLocation.addressName,
      coords: myLocation.coords,
      message: 'أحتاج مساعدة عاجلة أو اتصال سريع!',
    };
    setEmergencyAlert(alert);
    broadcastAppEvent('EMERGENCY_TRIGGERED', alert);
  };

  // Dismiss Emergency
  const handleDismissEmergency = () => {
    setEmergencyAlert(null);
    broadcastAppEvent('EMERGENCY_DISMISSED', {});
    showToast('تم إيقاف حالة الطوارئ 🛡️', 'أنت بأمان الآن والحمد لله.');
  };

  // Trigger Good News
  const handleSendGoodNews = (title: string, message: string) => {
    const alert: GoodNewsAlert = {
      active: true,
      triggeredBy: currentUserId,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      title,
      message,
      category: 'joy',
    };
    setGoodNewsAlert(alert);
    broadcastAppEvent('GOOD_NEWS_TRIGGERED', alert);
    setShowGoodNewsPicker(false);
    handleIncreaseLoveMeter(10, 'مشاركة فرحة');
  };

  // Spontaneous Ping send
  const handleSendSpontaneousPing = (
    title: string,
    message: string,
    type: 'love_ping' | 'water' | 'smile' | 'hug' | 'mystery_alarm'
  ) => {
    const ping: SpontaneousPing = {
      id: `ping-${Date.now()}`,
      title,
      message,
      type,
      senderId: currentUserId,
      timestamp: 'الآن',
    };
    setPingsHistory((prev) => [ping, ...prev]);
    broadcastAppEvent('SPONTANEOUS_PING', ping);
    showToast(title, message, '🔔');
    handleIncreaseLoveMeter(5, 'إشعار حب مفاجئ');
  };

  // Schedule Custom & Non-Specified Alarms by clock time
  const handleAddScheduledAlarm = (alarmData: Omit<ScheduledAlarm, 'id' | 'createdAt'>) => {
    const newAlarm: ScheduledAlarm = {
      ...alarmData,
      id: `alarm-${Date.now()}`,
      createdAt: 'الآن',
    };
    setScheduledAlarms((prev) => [newAlarm, ...prev]);
    showToast('⏰ تم ضبط وتفعيل المنبه بالوقت!', `${newAlarm.title} - ${newAlarm.scheduledForText}`);
    handleIncreaseLoveMeter(6, 'ضبط منبه بالوقت');
  };

  const handleToggleScheduledAlarm = (id: string) => {
    setScheduledAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleDeleteScheduledAlarm = (id: string) => {
    setScheduledAlarms((prev) => prev.filter((a) => a.id !== id));
    showToast('تم حذف المنبه 🗑️', 'تمت إزالة المنبه بنجاح.');
  };

  const handleTriggerAlarmNow = (alarm: ScheduledAlarm) => {
    playLovePingSound();
    const ping: SpontaneousPing = {
      id: `ping-${Date.now()}`,
      senderId: currentUserId,
      title: `🔔 رنة منبه بالوقت: ${alarm.title}`,
      message: alarm.message,
      type: 'mystery_alarm',
      timestamp: 'الآن',
    };
    setPingsHistory((prev) => [ping, ...prev]);
    broadcastAppEvent('SPONTANEOUS_PING', ping);
    showToast(`🔔 رنة منبه ${currentUser.name}: ${alarm.title}`, alarm.message, '⏰');
  };

  // Questions Handlers
  const handleAnswerQuestion = (questionId: string, answerText: string) => {
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    let updatedAnswers: any = {};

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          updatedAnswers = {
            ...q.answers,
            [currentUserId]: {
              text: answerText,
              answeredAt: nowTime,
            },
          };
          return {
            ...q,
            answers: updatedAnswers,
          };
        }
        return q;
      })
    );

    broadcastAppEvent('QUESTION_ANSWERED', {
      questionId,
      answeredByName: currentUser.name,
      answerText,
      answers: updatedAnswers,
    });

    handleIncreaseLoveMeter(15, 'إجابة سؤال اليوم');
    showToast(
      'تم إرسال إجابتك وإشعار الطرف التاني! 💌',
      `وصل إشعار لـ ${partnerUser.name} إنك جاوبت ع السؤال`
    );
  };

  const handleAddNewQuestion = (questionText: string) => {
    const newQ: DailyQuestion = {
      id: `q-${Date.now()}`,
      question: questionText,
      dateStr: new Date().toISOString().split('T')[0],
      addedBy: currentUserId,
      answers: {},
    };
    setQuestions((prev) => [newQ, ...prev]);
    showToast(
      `تم طرح سؤال مفاجئ جديد لـ ${partnerUser.name} ❓`,
      'سيظهر لها فوراً في الشاشة للإجابة عليه!'
    );
  };

  // Call simulation
  const handleSimulateCall = (user: UserProfile) => {
    setActiveCallModal(user);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Navbar with Notifications as First Tab and GPS as Last Tab */}
      <Navbar
        currentUserId={currentUserId}
        currentUser={currentUser}
        partnerUser={partnerUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSwitchUser={setCurrentUserId}
        loveMeter={loveMeter}
        onTriggerEmergency={handleTriggerEmergency}
        onTriggerGoodNews={() => setShowGoodNewsPicker(true)}
        onOpenSpontaneousPings={() => setShowSpontaneousModal(true)}
      />

      {/* Floating In-App Toast Notification */}
      {toastNotification && (
        <div className="fixed top-20 inset-x-0 mx-auto w-fit max-w-md z-50 px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="rounded-2xl bg-slate-900/95 border-2 border-rose-500/50 shadow-2xl p-3.5 flex items-start gap-3 backdrop-blur-xl">
            <span className="text-2xl shrink-0">{toastNotification.icon || '💌'}</span>
            <div className="flex-1 text-right">
              <h5 className="font-bold text-white text-xs sm:text-sm">
                {toastNotification.title}
              </h5>
              <p className="text-xs text-rose-200 mt-0.5 line-clamp-2">
                {toastNotification.message}
              </p>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2.5 sm:p-6 pb-24 sm:pb-8">
        {/* TAB 1: NOTIFICATIONS & SPONTANEOUS ALARMS (DEFAULT STARTING VIEW) */}
        {activeTab === 'notifications' && (
          <NotificationsView
            currentUserId={currentUserId}
            currentUser={currentUser}
            partnerUser={partnerUser}
            pingsHistory={pingsHistory}
            scheduledAlarms={scheduledAlarms}
            pairing={pairing}
            onSendPing={handleSendSpontaneousPing}
            onAddScheduledAlarm={handleAddScheduledAlarm}
            onToggleScheduledAlarm={handleToggleScheduledAlarm}
            onDeleteScheduledAlarm={handleDeleteScheduledAlarm}
            onTriggerAlarmNow={handleTriggerAlarmNow}
            onTriggerGoodNews={() => setShowGoodNewsPicker(true)}
            onTriggerEmergency={handleTriggerEmergency}
            onSendSafeArrival={handleSendSafeArrival}
            onGoToTab={(t) => setActiveTab(t)}
          />
        )}

        {/* TAB 2: COUPLE CHAT */}
        {activeTab === 'chat' && (
          <ChatView
            currentUserId={currentUserId}
            currentUser={currentUser}
            partnerUser={partnerUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            onSendLoveHeart={handleSendLoveHeart}
          />
        )}

        {/* TAB 3: LOVE METER & MYSTERY BOXES (RICH ROMANTIC LETTERS) */}
        {activeTab === 'love' && (
          <LoveMeterView
            currentUserId={currentUserId}
            currentUser={currentUser}
            partnerUser={partnerUser}
            loveMeter={loveMeter}
            onIncreaseLoveMeter={handleIncreaseLoveMeter}
            onResetLoveMeter={() => setLoveMeter(0)}
            mysteryRewards={mysteryRewards}
            onAddCustomReward={(reward) => setMysteryRewards((prev) => [reward, ...prev])}
          />
        )}

        {/* TAB 4: MILESTONES & BIRTHDAYS */}
        {activeTab === 'milestones' && (
          <MilestonesView
            currentUserId={currentUserId}
            currentUser={currentUser}
            partnerUser={partnerUser}
            milestones={milestones}
            onAddMilestone={(m) =>
              setMilestones((prev) => [{ ...m, id: `m-${Date.now()}` }, ...prev])
            }
            onUpdateMilestone={(m) =>
              setMilestones((prev) => prev.map((item) => (item.id === m.id ? m : item)))
            }
            onDeleteMilestone={(id) =>
              setMilestones((prev) => prev.filter((item) => item.id !== id))
            }
          />
        )}

        {/* TAB 5: DAILY QUESTIONS */}
        {activeTab === 'questions' && (
          <QuestionsView
            currentUserId={currentUserId}
            currentUser={currentUser}
            partnerUser={partnerUser}
            questions={questions}
            onAnswerQuestion={handleAnswerQuestion}
            onAddNewQuestion={handleAddNewQuestion}
          />
        )}

        {/* TAB 6: GPS & LOCATION TRACKING (AT THE END AS REQUESTED) */}
        {activeTab === 'gps' && (
          <GPSView
            currentUserId={currentUserId}
            currentUser={currentUser}
            partnerUser={partnerUser}
            myLocation={myLocation}
            partnerLocation={partnerLocation}
            onUpdateMyLocation={handleUpdateMyLocation}
            onSendSafeArrival={handleSendSafeArrival}
            onRequestCall={() => handleSimulateCall(partnerUser)}
          />
        )}
      </main>

      {/* Emergency Modal if Triggered */}
      {emergencyAlert && (
        <EmergencyModal
          alert={emergencyAlert}
          senderProfile={users[emergencyAlert.triggeredBy]}
          onDismiss={handleDismissEmergency}
          onCall={() => handleSimulateCall(users[emergencyAlert.triggeredBy])}
        />
      )}

      {/* Good News Modal if Triggered */}
      {goodNewsAlert && (
        <GoodNewsModal
          alert={goodNewsAlert}
          senderProfile={users[goodNewsAlert.triggeredBy]}
          onDismiss={() => setGoodNewsAlert(null)}
          onCall={() => handleSimulateCall(users[goodNewsAlert.triggeredBy])}
        />
      )}

      {/* Spontaneous Pings & Random Alarm Modal */}
      {showSpontaneousModal && (
        <SpontaneousPingsModal
          currentUserId={currentUserId}
          currentUser={currentUser}
          partnerUser={partnerUser}
          onSendPing={handleSendSpontaneousPing}
          onScheduleRandomAlarm={(min, note) => {
            handleAddScheduledAlarm({
              senderId: currentUserId,
              title: 'منبه عشوائي بالوقت ⏰',
              message: note || 'افتكرتك فجأة في نص اليوم، وحبيت أقولك بحبك 🤍',
              alarmType: 'exact_time',
              exactTime: '17:00',
              targetTimestamp: Date.now() + min * 60 * 1000,
              scheduledForText: `الساعة 05:00 مساءً`,
              active: true,
              category: 'love',
            });
          }}
          onClose={() => setShowSpontaneousModal(false)}
        />
      )}

      {/* Good News Trigger Selector Modal */}
      {showGoodNewsPicker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-amber-400/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                حاجة حلوة حصلت معايا! 🎉
              </h4>
              <button
                onClick={() => setShowGoodNewsPicker(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              اختار نوع الفرحة، وهيرن فوراً عند {partnerUser.name} برنة مبهجة وبشرى خير عشان يكلمك يباركلك!
            </p>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {[
                { title: 'نجاح وفرحة كبيرة! 🎓🏆', desc: 'خبر نجاح أو إنجاز مهم مستنيه من فترة' },
                { title: 'اتقبلت في الشغل / ترقية! 💼✨', desc: 'بشرى خير في الشغل والدخل' },
                { title: 'فرحان وعاوز أسمع صوتك! 🥰❤️', desc: 'قلبي فرحان ومحتاج أشاركك السعادة' },
                { title: 'مفاجأة مبهجة محضرهالك! 🎁🌸', desc: 'حاجة حلوة عملتهالك وهتفرحك' },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendGoodNews(opt.title, opt.desc)}
                  className="p-3 rounded-2xl bg-slate-800/80 hover:bg-amber-950/40 hover:border-amber-400/50 border border-white/5 text-right transition group"
                >
                  <p className="font-bold text-white text-xs group-hover:text-amber-300">
                    {opt.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Simulated Phone Call Interface */}
      {activeCallModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 text-center space-y-5 shadow-2xl">
            <div className="relative mx-auto w-24 h-24">
              <img
                src={activeCallModal.avatar}
                alt={activeCallModal.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/80 shadow-2xl"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-emerald-400 font-bold animate-pulse">
                جاري الاتصال الآمن...
              </span>
              <h3 className="text-xl font-black text-white">{activeCallModal.name}</h3>
              <p className="text-xs text-slate-400">{activeCallModal.phone}</p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  window.location.href = `tel:${activeCallModal.phone}`;
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
              >
                <PhoneCall className="w-4 h-4" />
                فتح في الهاتف
              </button>
              <button
                onClick={() => setActiveCallModal(null)}
                className="flex-1 py-3 rounded-2xl bg-red-650 hover:bg-red-700 bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                إنهاء المكالمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
