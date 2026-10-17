import React, { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Send,
  Sparkles,
  CheckCircle,
  Clock,
  Heart,
  Plus,
  Flame,
} from 'lucide-react';
import { DailyQuestion, UserId, UserProfile } from '../types';
import { playGoodNewsChime, playMessageSound } from '../utils/audio';

interface QuestionsViewProps {
  currentUserId: UserId;
  currentUser: UserProfile;
  partnerUser: UserProfile;
  questions: DailyQuestion[];
  onAnswerQuestion: (questionId: string, answerText: string) => void;
  onAddNewQuestion: (questionText: string) => void;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  currentUserId,
  currentUser,
  partnerUser,
  questions,
  onAnswerQuestion,
  onAddNewQuestion,
}) => {
  const [currentAnswerText, setCurrentAnswerText] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Today's primary question is the first in list
  const todayQuestion = questions[0];
  const myAnswer = todayQuestion?.answers[currentUserId];
  const partnerAnswer = todayQuestion?.answers[partnerUser.id];

  const handleSendAnswer = () => {
    if (!currentAnswerText.trim() || !todayQuestion) return;
    onAnswerQuestion(todayQuestion.id, currentAnswerText.trim());
    setCurrentAnswerText('');
    playGoodNewsChime();
  };

  const handleCreateQuestion = () => {
    if (!newQuestionText.trim()) return;
    onAddNewQuestion(newQuestionText.trim());
    setNewQuestionText('');
    setShowAddModal(false);
    playMessageSound();
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-pink-950/80 border border-purple-500/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              سؤال اليوم المفاجئ لحمودي & سيمو 💌
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              أسئلة القلوب وتقريب المسافات
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              سؤال مفاجئ يومي خاص بيكم، أول ما تجاوبوا بيوصل إشعار فوري للطرف التاني إنك جاوبت!
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shrink-0"
          >
            <Plus className="w-4 h-4" />
            اطرح سؤال مفاجئ لحبيبتك الآن
          </button>
        </div>
      </div>

      {/* Featured Today Question Card */}
      {todayQuestion && (
        <div className="rounded-3xl bg-slate-900/90 border-2 border-purple-500/40 p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-purple-300 font-semibold">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>سؤال اليوم المحدد: {todayQuestion.dateStr}</span>
            </div>

            <div className="flex items-center gap-2">
              {myAnswer ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  أنت جاوبت (+15% حب)
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold animate-pulse">
                  مستني إجابتك ✍️
                </span>
              )}
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
            "{todayQuestion.question}"
          </h3>

          {/* Answers Grid: Partner Answer & My Answer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Partner's Answer Box */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={partnerUser.avatar}
                    alt={partnerUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-purple-400"
                  />
                  <span className="font-bold text-sm text-purple-300">
                    إجابة {partnerUser.name}:
                  </span>
                </div>
                {partnerAnswer && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {partnerAnswer.answeredAt}
                  </span>
                )}
              </div>

              {partnerAnswer ? (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-sm text-purple-100 font-medium leading-relaxed">
                  "{partnerAnswer.text}"
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 text-center text-xs text-slate-400">
                  {partnerUser.name} لسه مجاوبتش على السؤال ده.. أول ما تجاوب هيوصلك إشعار فوري! 🔔
                </div>
              )}
            </div>

            {/* My Answer Box */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-rose-400"
                  />
                  <span className="font-bold text-sm text-rose-300">
                    إجابتي أنا ({currentUser.name}):
                  </span>
                </div>
                {myAnswer && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {myAnswer.answeredAt}
                  </span>
                )}
              </div>

              {myAnswer ? (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-sm text-rose-100 font-medium leading-relaxed">
                  "{myAnswer.text}"
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={currentAnswerText}
                    onChange={(e) => setCurrentAnswerText(e.target.value)}
                    placeholder={`اكتب إجابتك من قلبك لـ ${partnerUser.name}...`}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                  <button
                    onClick={handleSendAnswer}
                    disabled={!currentAnswerText.trim()}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 disabled:opacity-40 text-white font-bold text-xs transition shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    إرسال الإجابة وإشعار {partnerUser.name} فوراً
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions Archive */}
      <div className="space-y-3">
        <h4 className="font-bold text-white text-base flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-purple-400" />
          أرشيف الأسئلة السابقة وإجاباتنا الحلوة:
        </h4>

        <div className="space-y-3">
          {questions.slice(1).map((q) => (
            <div
              key={q.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3 hover:border-purple-500/30 transition"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{q.dateStr}</span>
                <span className="text-purple-300 font-semibold">سؤال سابق</span>
              </div>
              <h5 className="font-bold text-white text-sm">"{q.question}"</h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.answers.hamoudi && (
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="font-bold text-rose-400 block mb-0.5">حمودي:</span>
                    <p className="text-slate-300">"{q.answers.hamoudi.text}"</p>
                  </div>
                )}
                {q.answers.simo && (
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="font-bold text-purple-400 block mb-0.5">سيمو:</span>
                    <p className="text-slate-300">"{q.answers.simo.text}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Sudden Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-purple-500/40 p-6 shadow-2xl space-y-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              طرح سؤال مفاجئ جديد لـ {partnerUser.name}
            </h4>
            <p className="text-xs text-slate-300">
              اكتب سؤال مميز حابب تعرف إجابته من شريكك، وهيتبعتله إشعار فوري بالسؤال ليجاوب عليه!
            </p>
            <div>
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="مثال: لو هنسمي أول بيبي تختار اسم إيه؟ أو أكتر حاجة بتفرحك معايا؟"
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateQuestion}
                disabled={!newQuestionText.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 disabled:opacity-50 text-white font-bold text-xs"
              >
                إرسال السؤال المفاجئ 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
