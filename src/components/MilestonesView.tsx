import React, { useState, useRef } from 'react';
import {
  Calendar,
  Heart,
  Plus,
  Clock,
  Edit2,
  Trash2,
  Camera,
  Sparkles,
  Gift,
  Smile,
} from 'lucide-react';
import { Milestone, UserId, UserProfile } from '../types';

interface MilestonesViewProps {
  currentUserId: UserId;
  currentUser: UserProfile;
  partnerUser: UserProfile;
  milestones: Milestone[];
  relationshipStartDate?: string;
  onAddMilestone: (m: Omit<Milestone, 'id'>) => void;
  onUpdateMilestone: (m: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({
  currentUserId,
  currentUser,
  partnerUser,
  milestones,
  relationshipStartDate = '2024-03-15',
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formCategory, setFormCategory] = useState<Milestone['category']>('birthday');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Calculate days in love (since first milestone or start date)
  const startDate = new Date(relationshipStartDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30.4);

  const openAddModal = () => {
    setEditingMilestone(null);
    setFormTitle('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormCategory('anniversary');
    setFormDescription('');
    setFormImageUrl('');
    setShowAddModal(true);
  };

  const openEditModal = (m: Milestone) => {
    setEditingMilestone(m);
    setFormTitle(m.title);
    setFormDate(m.date);
    setFormCategory(m.category);
    setFormDescription(m.description || '');
    setFormImageUrl(m.imageUrl || '');
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formDate) return;

    if (editingMilestone) {
      onUpdateMilestone({
        ...editingMilestone,
        title: formTitle.trim(),
        date: formDate,
        category: formCategory,
        description: formDescription.trim(),
        imageUrl: formImageUrl || editingMilestone.imageUrl,
      });
    } else {
      onAddMilestone({
        title: formTitle.trim(),
        date: formDate,
        category: formCategory,
        description: formDescription.trim(),
        imageUrl:
          formImageUrl ||
          'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
      });
    }
    setShowAddModal(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate days remaining or passed for a milestone
  const getDaysStatus = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    // Normalize to midnight
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diff = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) {
      return { text: 'اليوم! كل سنة وإحنا سوا 🎉❤️', isToday: true, isFuture: false, days: 0 };
    } else if (diff > 0) {
      return { text: `باقي ${diff} يوم`, isToday: false, isFuture: true, days: diff };
    } else {
      return { text: `مر عليه ${Math.abs(diff)} يوم من الحب`, isToday: false, isFuture: false, days: Math.abs(diff) };
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Love Duration Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-rose-950/80 border border-rose-500/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              عداد أيام العشق والأمان
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              عمر حبنا مع بعض: <span className="text-rose-400">{diffDays}</span> يوم
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              أي ما يعادل {diffMonths} شهر من الضحك، والمواقف، والوعود الحلوة، والأمان الحقيقي بين حمودي وسيمو 🤍
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-rose-900/30 shrink-0"
          >
            <Plus className="w-4 h-4" />
            إضافة مناسبة خاصة جديدة
          </button>
        </div>
      </div>

      {/* Milestones Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((milestone) => {
          const status = getDaysStatus(milestone.date);

          return (
            <div
              key={milestone.id}
              className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-white/10 hover:border-rose-500/40 transition-all duration-300 shadow-xl group flex flex-col justify-between"
            >
              {/* Image banner */}
              {milestone.imageUrl && (
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={milestone.imageUrl}
                    alt={milestone.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                  {/* Days pill badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border shadow-lg backdrop-blur-md ${
                        status.isToday
                          ? 'bg-rose-500 text-white border-rose-400 animate-bounce'
                          : status.isFuture
                          ? 'bg-amber-500/80 text-white border-amber-400/50'
                          : 'bg-slate-900/80 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {status.text}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEditModal(milestone)}
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-600 text-slate-200 hover:text-white transition backdrop-blur-md"
                      title="تعديل المناسبة والتاريخ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMilestone(milestone.id)}
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-red-600 text-slate-200 hover:text-white transition backdrop-blur-md"
                      title="حذف المناسبة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Content body */}
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{milestone.date}</span>
                    <span>•</span>
                    <span>
                      {milestone.category === 'birthday' && '🎂 عيد ميلاد'}
                      {milestone.category === 'anniversary' && '💖 ذكرى سنوية'}
                      {milestone.category === 'first_date' && '☕ أول لقاء'}
                      {milestone.category === 'engagement' && '💍 خطوبة'}
                      {milestone.category === 'wedding' && '🕊️ كتب كتاب'}
                      {milestone.category === 'custom' && '✨ يوم مميز'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-rose-200 transition">
                    {milestone.title}
                  </h3>

                  {milestone.description && (
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {milestone.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    تاريخ مسجل في كتاب ذكرياتنا
                  </span>
                  <span className="text-rose-400 font-semibold">حمودي & سيمو 🤍</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-rose-500/30 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-400" />
              {editingMilestone ? 'تعديل تاريخ ومناسبة خاصة' : 'إضافة مناسبة وتاريخ خاص جديد'}
            </h4>

            {/* Title */}
            <div>
              <label className="text-xs text-slate-300 block mb-1">عنوان المناسبة:</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="مثال: عيد ميلاد سيمو، أول مرة خرجنا سوا..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">التاريخ المخصص:</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">تصنيف المناسبة:</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as Milestone['category'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="birthday">عيد ميلاد 🎂</option>
                  <option value="first_date">أول مقابلة ☕</option>
                  <option value="anniversary">ذكرى سنوية 💖</option>
                  <option value="engagement">خطوبة 💍</option>
                  <option value="wedding">كتب كتاب 🕊️</option>
                  <option value="custom">مناسبة خاصة ✨</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-slate-300 block mb-1">كلمة أو ذكرى خاصة بالمناسبة:</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="اكتب تفاصيل أو شعورك باليوم ده..."
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Custom Photo Upload */}
            <div>
              <label className="text-xs text-slate-300 block mb-1">صورة خاصة بالذكرى:</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-white/10 transition"
                >
                  <Camera className="w-4 h-4 text-rose-400" />
                  رفع صورة من جهازك
                </button>
                {formImageUrl && (
                  <img
                    src={formImageUrl}
                    alt="معاينة"
                    className="w-10 h-10 rounded-xl object-cover border border-rose-500/40"
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-medium"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={!formTitle.trim() || !formDate}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-900/30"
              >
                {editingMilestone ? 'حفظ التعديلات' : 'إضافة المناسبة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
