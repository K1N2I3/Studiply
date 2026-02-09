import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Sparkles, Map, Compass, Layers, ArrowUpRight, BookMarked, Brain, Camera } from 'lucide-react'

const SUBJECTS = [
  {
    id: 'italian',
    name: 'Italian Language',
    headline: 'Speak with style and confidence',
    description: 'Master expressive communication, cultural nuances, and modern Italian conversation.',
    highlights: ['Daily conversation labs', 'Cultural immersion capsules', 'Grammar accelerators'],
    challenge: 'Host a 10-minute live conversation with a native mentor.'
  },
  {
    id: 'english',
    name: 'English Language',
    headline: 'Craft global communication fluency',
    description: 'Elevate storytelling, academic writing, and persuasive speaking for any audience.',
    highlights: ['Story craft workshops', 'Debate lounge', 'Academic writing studio'],
    challenge: 'Deliver a persuasive talk to a real audience.'
  },
  {
    id: 'spanish',
    name: 'Spanish Language',
    headline: 'Connect through vibrant dialogue',
    description: 'Learn practical conversation, cultural context, and regional expressions.',
    highlights: ['Immersive conversation tables', 'Latin culture capsules', 'Listening labs'],
    challenge: 'Produce a video journal entirely in Spanish.'
  },
  {
    id: 'french',
    name: 'French Language',
    headline: 'Speak with elegance and nuance',
    description: 'Combine grammar mastery with cultural experiences from France and beyond.',
    highlights: ['Pronunciation ateliers', 'French cinema club', 'Grammar masterclasses'],
    challenge: 'Host a French café-style conversation session.'
  },
  {
    id: 'german',
    name: 'German Language',
    headline: 'Engineer precise and powerful communication',
    description: 'Build vocabulary and grammar for academic, travel, and professional contexts.',
    highlights: ['Technical vocabulary labs', 'Cultural immersion panels', 'Grammar drills'],
    challenge: 'Publish an informative article in German.'
  },
  {
    id: 'mandarin',
    name: 'Mandarin Chinese',
    headline: 'Navigate tonal language with confidence',
    description: 'Master tones, characters, and cultural etiquette for real-world interactions.',
    highlights: ['Tone dojo sessions', 'Character design labs', 'Conversation with mentors'],
    challenge: 'Complete a live Q&A session entirely in Mandarin.'
  },
  {
    id: 'business',
    name: 'Business & Entrepreneurship',
    headline: 'Design ventures that deliver value',
    description: 'Blend strategy, finance, marketing, and leadership into a purposeful business vision.',
    highlights: ['Pitch studio', 'Business model sprint', 'Financial fluency lab'],
    challenge: 'Launch a micro venture and present results to advisors.'
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    headline: 'Think critically and ask bigger questions',
    description: 'Explore ethics, logic, metaphysics, and modern thought to sharpen perspective.',
    highlights: ['Socratic dialogues', 'Logic puzzles', 'Ethics case labs'],
    challenge: 'Lead a Socratic seminar on a contemporary dilemma.'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    headline: 'Think in elegant structures',
    description: 'Explore problem solving through algebraic design, geometric intuition, and calculus thinking.',
    highlights: ['Strategy studio', 'Proof builders', 'Visual geometry labs'],
    challenge: 'Design a strategy guide that solves a real-world optimisation problem.'
  },
  {
    id: 'computerScience',
    name: 'Computer Science',
    headline: 'Build intelligent digital ideas',
    description: 'Develop code, algorithms, and data intuition to create human-centred technology.',
    highlights: ['Product sprints', 'Algorithm playground', 'AI prompt gym'],
    challenge: 'Ship a working prototype to the Launch Gallery.'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    headline: 'Design reactions with purpose',
    description: 'Investigate matter, reactions, and material science through guided experimentation.',
    highlights: ['Organic synthesis quests', 'Analytical playbook', 'Safety-first lab design'],
    challenge: 'Deliver a full lab report with data visualisations.'
  },
  {
    id: 'biology',
    name: 'Biology',
    headline: 'Understand life at every scale',
    description: 'Dive into cellular systems, genetics, ecology, and evolutionary storytelling.',
    highlights: ['Microscope adventures', 'Field ecology journeys', 'Genetics code labs'],
    challenge: 'Curate a micro-documentary about a living system.'
  },
  {
    id: 'history',
    name: 'History',
    headline: 'Connect past to present narratives',
    description: 'Analyse ancient, medieval, and modern turning points to forecast the future.',
    highlights: ['Time capsule writing', 'Debate forums', 'Archive exploration'],
    challenge: 'Publish a timeline that reframes a historic event for today.'
  },
  {
    id: 'geography',
    name: 'Geography',
    headline: 'Map human and natural systems',
    description: 'Blend physical landscapes with human stories through cartography and exploration.',
    highlights: ['Map lab', 'Sustainable development case files', 'Geo-data expeditions'],
    challenge: 'Build an interactive map that tells a data-driven story.'
  }
]

const QuestAcademy = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [activeSubject, setActiveSubject] = useState(SUBJECTS[0])

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
    }`}>
      {/* floating glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="absolute top-1/2 left-10 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 lg:flex-row">
        {/* Hero + detail */}
        <section className={`flex-1 rounded-4xl border px-7 py-9 shadow-2xl backdrop-blur ${
          isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white'
        }`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3.5 py-2 text-[11px] font-semibold text-purple-500">
                <Sparkles className="h-3.5 w-3.5" /> Immersive Learning Journey
              </div>
              <h1 className="mt-3.5 text-3xl font-black tracking-tight md:text-3.5xl">
                Quest Academy
              </h1>
              <p className={`mt-3 max-w-xl text-sm md:text-base ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>
                Choose a realm of knowledge and we will craft a tailored path of quests, workshops, and mentor moments. Switch subjects at any time to explore parallel worlds of understanding.
              </p>
            </div>
            <div className={`rounded-3xl px-5 py-4 text-sm font-medium shadow-lg ${
              isDark ? 'bg-gradient-to-br from-purple-500/40 to-pink-500/40 text-white' : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
            }`}>
              <p className="text-[11px] uppercase tracking-wide opacity-80">Current focus</p>
              <h2 className="mt-2 text-lg font-semibold">{activeSubject.name}</h2>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{activeSubject.headline}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className={`rounded-3xl border px-6 py-6 ${
              isDark ? 'border-white/10 bg-black/35' : 'border-slate-200 bg-white'
            }`}>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-purple-400">
                <Compass className="h-4 w-4" /> Subject Overview
              </h3>
              <p className={`mt-4 text-sm leading-relaxed ${
                isDark ? 'text-white/80' : 'text-slate-700'
              }`}>
                {activeSubject.description}
              </p>
              <div className="mt-4 space-y-2.5">
                {activeSubject.highlights.map((item) => (
                  <div
                    key={item}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${
                      isDark ? 'bg-white/6 text-white/80' : 'bg-purple-50 text-purple-700'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`flex h-full flex-col justify-between rounded-3xl border px-6 py-6 ${
              isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
            }`}>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-purple-400">Signature challenge</p>
                <p className={`mt-3 text-sm leading-relaxed ${
                  isDark ? 'text-white/80' : 'text-slate-700'
                }`}>
                  {activeSubject.challenge}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/quest-academy/quests', { state: { subject: activeSubject.id } })}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform hover:-translate-y-0.5"
              >
                Start curated plan
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Homework Helper Feature Card */}
          <div 
            onClick={() => navigate('/homework-helper')}
            className={`mt-6 cursor-pointer rounded-3xl border px-6 py-6 transition-all hover:scale-[1.01] hover:shadow-xl ${
              isDark 
                ? 'border-orange-500/30 bg-gradient-to-br from-orange-500/15 via-rose-500/10 to-transparent hover:border-orange-400/50' 
                : 'border-orange-200 bg-gradient-to-br from-orange-50 to-rose-50 hover:border-orange-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl ${
                    isDark ? 'bg-orange-500/20' : 'bg-orange-100'
                  }`}>
                    <BookMarked className={`h-5 w-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Homework Helper
                    </h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                    }`}>
                      <Brain className="inline h-3 w-3 mr-1" />
                      AI Learning Companion
                    </span>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                  Stuck on homework? Upload a photo or describe your problem, and I'll guide you step-by-step to understand and solve it yourself. 
                  <span className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}> No direct answers</span> — just real learning!
                </p>
              </div>
              <div className={`flex-shrink-0 flex items-center gap-3 ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Camera className={`h-6 w-6 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
                  <span className="text-[10px]">Take Photo</span>
                </div>
                <ArrowUpRight className={`h-5 w-5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
              </div>
            </div>
          </div>
        </section>

        {/* Subject selector */}
        <aside className={`w-full max-w-xs space-y-4 rounded-4xl border px-6 py-7 backdrop-blur lg:flex-shrink-0 ${
          isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white'
        }`}>
          <div className="flex items-center gap-3 pb-3">
            <div className="rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-3 text-white shadow-lg">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-purple-400">World Map</p>
              <h2 className="text-base font-semibold">Select a realm</h2>
            </div>
          </div>

          <div
            className="space-y-2 overflow-y-auto pr-1"
            style={{ maxHeight: '65vh' }}
          >
            <style>{`
              .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
              .hide-scrollbar { scrollbar-width: none; }
            `}</style>
            <div className="hide-scrollbar">
              {SUBJECTS.map((subject) => {
                const isActive = activeSubject.id === subject.id
                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => setActiveSubject(subject)}
                    className={`mb-2 w-full rounded-2xl px-4 py-3 text-left transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : isDark
                          ? 'bg-white/5 text-white/70 hover:bg-white/10'
                          : 'bg-white/85 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <p className="text-sm font-semibold">{subject.name}</p>
                    <p className={`mt-1 text-xs ${isActive ? 'text-white/80' : isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      {subject.headline}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default QuestAcademy
