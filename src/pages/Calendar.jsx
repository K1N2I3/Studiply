import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Target, BookOpen, Users, Trophy, Gift, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import NotificationSystem from '../components/NotificationSystem';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';
import { fetchCalendarEvents, createCalendarEvent, deleteCalendarEvent } from '../services/calendarService';
import { checkAndSendEventReminders } from '../services/calendarReminderService';

const CalendarPage = () => {
  const { isDark } = useTheme();
  const { user } = useSimpleAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'study',
    description: '',
    subject: '',
    reminderDays: 1
  });

  // 获取当前月份的天数
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // 获取月份第一天是星期几
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // 生成日历网格（固定 6 行 7 列），包含前后月份的日期
  const generateCalendarGrid = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 - firstDay);
    const grid = [];

    for (let i = 0; i < 42; i++) {
      const dayDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
      const isCurrentMonth = dayDate.getMonth() === currentDate.getMonth();

      grid.push({
        key: `${dayDate.getFullYear()}-${dayDate.getMonth()}-${dayDate.getDate()}`,
        date: dayDate,
        label: dayDate.getDate(),
        isCurrentMonth,
      });
    }

    return grid;
  };

  // 获取日期的事件
  const getEventsForDate = (date) => {
    const dateStr = date.toDateString();
    return events.filter(event => new Date(event.date).toDateString() === dateStr);
  };

  // 添加事件
  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.time) {
      const baseEvent = {
        ...newEvent,
        date: selectedDate.toISOString()
      };

      try {
        let createdEvent;

        if (user?.id) {
          createdEvent = await createCalendarEvent(user.id, baseEvent);
        } else {
          createdEvent = {
            id: crypto?.randomUUID?.() || Date.now().toString(),
            ...baseEvent
          };
        }

        setEvents((prev) => [...prev, createdEvent]);
        setNewEvent({ title: '', time: '', type: 'study', description: '', subject: '', reminderDays: 1 });
        setShowAddEvent(false);
      } catch (error) {
        console.error('Unable to add calendar event:', error);
      }
    }
  };

  // 删除事件
  const handleDeleteEvent = async (eventId) => {
    try {
      if (user?.id) {
        await deleteCalendarEvent(user.id, eventId);
      }
      setEvents((prev) => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Unable to delete calendar event:', error);
    }
  };

  // 获取事件类型图标
  const getEventIcon = (type) => {
    switch (type) {
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'homework': return <Target className="w-4 h-4" />;
      case 'summative': return <Trophy className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'mission': return <Trophy className="w-4 h-4" />;
      case 'reward': return <Gift className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // 获取事件类型颜色
  const getEventColor = (type) => {
    switch (type) {
      case 'study': return 'bg-blue-500';
      case 'homework': return 'bg-orange-500';
      case 'summative': return 'bg-red-500';
      case 'social': return 'bg-green-500';
      case 'mission': return 'bg-yellow-500';
      case 'reward': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = generateCalendarGrid();
  const selectedDateEvents = getEventsForDate(selectedDate);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      if (!user?.id) {
        setEvents([]);
        return;
      }

      setEventsLoading(true);
      try {
        const fetchedEvents = await fetchCalendarEvents(user.id);
        if (isMounted) {
          setEvents(fetchedEvents);
        }
      } catch (error) {
        console.error('Unable to load calendar events:', error);
      } finally {
        if (isMounted) {
          setEventsLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // 检查并发送事件提醒
  useEffect(() => {
    if (!user?.id || !user?.email) return;

    const checkReminders = async () => {
      try {
        await checkAndSendEventReminders(user.id, user.email, user.name);
      } catch (error) {
        console.error('Error checking reminders:', error);
      }
    };

    // 页面加载时检查一次
    checkReminders();

    // 每小时检查一次（可选，避免过于频繁）
    const interval = setInterval(() => {
      checkReminders();
    }, 60 * 60 * 1000); // 1小时

    return () => clearInterval(interval);
  }, [user?.id, user?.email, user?.name]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b] text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
    }`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute top-1/2 right-12 h-64 w-64 rounded-full bg-pink-400/25 blur-[120px]" />
        <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-blue-400/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 hide-scrollbar">
        {/* Hero */}
        <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-500">
            <Calendar className="h-4 w-4" /> Plan your adventures
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
            Map out study sessions, quests, and reminders in one view
          </h1>
          <p className={`mt-3 max-w-xl text-sm md:text-base ${
            isDark ? 'text-white/70' : 'text-slate-600'
          }`}>
            Navigate across months, add focused events, and review what is happening each day. Your learning journey is always one click away.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className={`rounded-2xl border px-4 py-4 ${
              isDark ? 'border-white/12 bg-white/8' : 'border-slate-200 bg-white'
            }`}>
              <p className="text-xs uppercase tracking-wide text-purple-400">Events this month</p>
              <p className={`mt-1 text-lg font-semibold ${isDark ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]' : 'text-slate-900'}`}>
                {events.filter(event => {
                  const d = new Date(event.date)
                  return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
                }).length}
              </p>
            </div>
            <div className={`rounded-2xl border px-4 py-4 ${
              isDark ? 'border-white/12 bg-white/8' : 'border-slate-200 bg-white'
            }`}>
              <p className="text-xs uppercase tracking-wide text-purple-400">Study sessions</p>
              <p className={`mt-1 text-lg font-semibold ${isDark ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]' : 'text-slate-900'}`}>
                {events.filter(event => event.type === 'study').length}
              </p>
            </div>
            <div className={`rounded-2xl border px-4 py-4 ${
              isDark ? 'border-white/12 bg-white/8' : 'border-slate-200 bg-white'
            }`}>
              <p className="text-xs uppercase tracking-wide text-purple-400">Upcoming reminders</p>
              <p className={`mt-1 text-lg font-semibold ${isDark ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]' : 'text-slate-900'}`}>
                {events.filter(event => new Date(event.date) >= new Date()).length}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]">
          {/* Calendar card */}
          <div className={`rounded-[32px] border px-6 py-6 shadow-lg backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-purple-400">Current month</p>
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className={`rounded-full p-3 transition ${
                    isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className={`rounded-full p-3 transition ${
                    isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className={`mt-6 grid grid-cols-7 gap-2 text-xs font-semibold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {dayNames.map(day => (
                <div key={day} className="text-center uppercase tracking-wide">
                  {day}
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 text-sm">
              {calendarDays.map(day => {
                const dayEvents = getEventsForDate(day.date)
                const isSelected = selectedDate.toDateString() === day.date.toDateString()
                const isToday = new Date().toDateString() === day.date.toDateString()

                return (
                  <button
                    key={day.key}
                    onClick={() => {
                      setSelectedDate(day.date)
                      if (!day.isCurrentMonth) {
                        setCurrentDate(new Date(day.date.getFullYear(), day.date.getMonth(), 1))
                      }
                    }}
                    className={`relative h-20 rounded-2xl border transition ${
                      isSelected
                        ? 'border-transparent bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : isToday
                        ? isDark
                          ? 'border-white/20 bg-white/10 text-white'
                          : 'border-purple-200 bg-purple-50 text-purple-600'
                        : day.isCurrentMonth
                        ? isDark
                          ? 'border-white/10 bg-white/6 text-white/80 hover:border-white/20 hover:bg-white/10'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        : isDark
                        ? 'border-transparent bg-transparent text-white/40'
                        : 'border-transparent bg-transparent text-slate-400'
                    }`}
                  >
                    <span className="text-sm font-medium">{day.label}</span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <span
                            key={event.id}
                            className={`h-1.5 w-1.5 rounded-full ${
                              event.type === 'study'
                                ? 'bg-blue-400'
                                : event.type === 'homework' || event.type === 'summative'
                                ? 'bg-yellow-400'
                                : event.type === 'social'
                                ? 'bg-green-400'
                                : 'bg-purple-400'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Events panel */}
          <div className={`rounded-[32px] border px-6 py-6 shadow-lg backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-purple-400">Selected date</p>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedDate.toLocaleDateString()}
                </h3>
              </div>
              <button
                onClick={() => setShowAddEvent(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:-translate-y-0.5 transition"
              >
                <Plus className="h-4 w-4" /> Add event
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[50vh] overflow-y-auto hide-scrollbar">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div key={event.id} className={`rounded-2xl border px-4 py-4 ${
                    isDark ? 'border-white/10 bg-white/8' : 'border-slate-200 bg-white'
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{event.title}</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{event.time || 'All day'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                          event.type === 'study'
                            ? 'bg-blue-500/15 text-blue-300'
                            : event.type === 'homework'
                            ? 'bg-yellow-500/15 text-yellow-300'
                            : event.type === 'summative'
                            ? 'bg-red-500/15 text-red-300'
                            : event.type === 'social'
                            ? 'bg-green-500/15 text-green-300'
                            : 'bg-purple-500/15 text-purple-300'
                        }`}>
                          {event.type}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className={`rounded-full p-2 transition ${
                            isDark ? 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {event.description && (
                      <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{event.description}</p>
                    )}
                    <div className="mt-3 text-xs text-slate-500 flex justify-end gap-3">
                      <span className="uppercase tracking-wide">Reminder {event.reminderDays}d before</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`rounded-2xl border px-6 py-12 text-center text-sm ${
                  isDark ? 'border-white/10 bg-white/8 text-white/60' : 'border-slate-200 bg-white text-slate-600'
                }`}>
                  No events scheduled for this date.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`rounded-3xl p-6 border-2 max-w-md mx-4 w-full ${
            isDark
              ? 'bg-slate-900/90 border-white/20'
              : 'bg-white/95 border-white/40 shadow-2xl'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Add Event
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-white/5 border-white/20 text-white'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                  placeholder="Event title"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Time
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-white/5 border-white/20 text-white'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-white/5 border-white/20 text-white'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  <option value="study">Study Session</option>
                  <option value="homework">Homework</option>
                  <option value="summative">Summative Test</option>
                  <option value="social">Social Event</option>
                  <option value="mission">Mission</option>
                  <option value="reward">Reward</option>
                </select>
              </div>

              {(newEvent.type === 'homework' || newEvent.type === 'summative') && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newEvent.subject}
                    onChange={(e) => setNewEvent({...newEvent, subject: e.target.value})}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      isDark
                        ? 'bg-white/5 border-white/20 text-white'
                        : 'bg-white border-gray-200 text-gray-800'
                    }`}
                    placeholder="e.g., Mathematics, Science, English"
                  />
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Reminder Days Before
                </label>
                <select
                  value={newEvent.reminderDays}
                  onChange={(e) => setNewEvent({...newEvent, reminderDays: parseInt(e.target.value)})}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-white/5 border-white/20 text-white'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  <option value={1}>1 day before</option>
                  <option value={2}>2 days before</option>
                  <option value={3}>3 days before</option>
                  <option value={7}>1 week before</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-white/5 border-white/20 text-white'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                  rows="3"
                  placeholder="Event description"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddEvent(false)}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                  isDark
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                  isDark
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationSystem events={events} />
    </div>
  )
}

export default CalendarPage;
