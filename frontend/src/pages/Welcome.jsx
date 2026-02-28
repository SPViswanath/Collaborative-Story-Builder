import { useNavigate } from "react-router-dom";
import {
  PenLine,
  Users,
  GitBranch,
  Lock,
  Mic,
  BookOpenText,
  Globe,
  Sparkles,
  ArrowRight,
  Share2
} from "lucide-react";

import Navbar from "../components/common/Navbar";
import { Mail, Linkedin } from "lucide-react";
import Img from "../assets/story1.jpg";

function Welcome() {
  const navigate = useNavigate();

  const topFeatures = [
    {
      title: "Write Chapters",
      desc: "Create and manage chapters smoothly with a clean workflow.",
      icon: <PenLine size={22} className="text-indigo-700" />,
    },
    {
      title: "Collaborators",
      desc: "Invite collaborators and build stories together in one space.",
      icon: <Users size={22} className="text-emerald-700" />,
    },
    {
      title: "Branches",
      desc: "Create alternate story branches and explore multiple paths.",
      icon: <GitBranch size={22} className="text-violet-700" />,
    },
    {
      title: "Chapter Locking",
      desc: "Avoid conflicts using lock/unlock protection while editing.",
      icon: <Lock size={22} className="text-amber-700" />,
    },
  ];

  const editorFeatures = [
    {
      title: "Rich Text Editor",
      desc: "Write naturally with formatting and a distraction-free layout.",
      icon: <Sparkles size={20} className="text-indigo-700" />,
    },
    {
      title: "Voice to Text",
      desc: "Convert speech into writing instantly while staying hands-free.",
      icon: <Mic size={20} className="text-emerald-700" />,
    },
    {
      title: "Reader Mode",
      desc: "Public reading experience for published stories.",
      icon: <BookOpenText size={20} className="text-violet-700" />,
    },
    {
      title: "Explore Classics",
      desc: "Read public domain books using external sources (Gutenberg).",
      icon: <Globe size={20} className="text-amber-700" />,
    },
  ];

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden bg-gradient-to-b from-slate-50 via-gray-100 to-slate-100">
      <Navbar page="Welcome" />

      {/* Soft blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute top-32 -right-40 w-[520px] h-[520px] rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/3 w-[620px] h-[620px] rounded-full bg-violet-200/35 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">

        {/* ================= HERO (UNCHANGED) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur border border-gray-200 px-3 py-1.5 rounded-full">
              <Sparkles size={16} className="text-indigo-700" />
              Build stories like a team
            </p>

            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              The Collaborative <br className="hidden md:block" />
              StoryBuilder Platform
            </h1>

            <p className="mt-4 text-gray-600 text-base md:text-lg leading-relaxed">
              Create chapters, explore branches, collaborate with others, and
              publish beautifully — all in one professional workspace.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-sm"
              >
                Open Dashboard <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/main")}
                className="px-5 py-3 rounded-xl bg-white/80 backdrop-blur border border-gray-200 text-gray-800 font-semibold hover:bg-white transition shadow-sm"
              >
                Explore Stories
              </button>
            </div>
          </div>

          {/* Top features (UNCHANGED) */}
          <div className="bg-white/85 backdrop-blur border border-gray-200 rounded-2xl shadow-md p-6 md:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Platform Highlights
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Editor • Chapters • Branches • Locks
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-emerald-50 border border-gray-200 flex items-center justify-center">
                <BookOpenText size={18} className="text-gray-800" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topFeatures.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 hover:shadow-sm transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    {f.icon}
                  </div>

                  <p className="mt-3 font-semibold text-gray-900">{f.title}</p>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= EDITOR FEATURES ================= */}
        <div className="mt-10 bg-white/85 backdrop-blur border border-gray-200 rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                A powerful editor experience
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Everything you need to write, branch and publish confidently.
              </p>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-700 font-semibold shadow-sm"
            >
              Start Writing
            </button>
          </div>

          {/* 🔹 MOBILE SLIDER (NEW – ONLY FOR MOBILE) */}
          <div className="md:hidden p-6">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {editorFeatures.map((item) => (
                <div
                  key={item.title}
                  className="
                    min-w-[85%]
                    snap-center
                    rounded-2xl
                    border border-gray-200
                    p-4
                    bg-gradient-to-b from-white to-gray-50
                    shadow-sm
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>

                    <p className="font-semibold text-gray-900">{item.title}</p>
                  </div>

                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 🔹 DESKTOP GRID (UNCHANGED) */}
          <div className="hidden md:block p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {editorFeatures.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 p-4 bg-gradient-to-b from-white to-gray-50 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>

                    <p className="font-semibold text-gray-900">{item.title}</p>
                  </div>

                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA (UNCHANGED) */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
              <div>
                <p className="font-bold text-lg">Publish & share your stories</p>
                <p className="text-sm text-gray-200 mt-1">
                  Readers can view published stories even without logging in.
                </p>
              </div>

              <button
                onClick={() => navigate("/main")}
                className="px-4 py-2 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition"
              >
                View Public Stories
              </button>
            </div>
          </div>
        </div>

        {/* ================= ABOUT (UNCHANGED) ================= */}
        <div className="mt-12 bg-white/85 backdrop-blur border border-gray-200 rounded-2xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6 py-8 md:px-10 md:py-12">

            {/* Left Content */}
            <div>
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                About StoryBuilder
              </p>

              <h2 className="mt-3 text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                Built for collaborative story writing
              </h2>

              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
                Modern Story writing platform designed for creators who value
                structure, collaboration, and creative freedom. Writers can organize
                chapters, explore alternate story branches, and collaborate seamlessly
                without conflicts in a single professional workspace.
              </p>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
                With a focused editor, intelligent chapter locking, and seamless publishing,
                StoryBuilder enables creators to publish their stories and share them publicly.
                Published stories can be read by anyone, while authors retain full control
                over their content and creative process.
              </p>
            </div>

            {/* Right Image — Desktop only */}
            <div className="hidden lg:flex justify-end">
              <div
                className="
                  w-full max-w-sm
                  rounded-2xl border border-gray-200
                  bg-gradient-to-b from-white to-gray-50
                  p-3 shadow-sm
                  transform transition-all duration-300
                  hover:-translate-y-2 hover:shadow-md
                "
              >
                <img
                  src={Img}
                  alt="StoryBuilder collaboration illustration"
                  className="w-full h-auto rounded-xl object-contain shadow-sm border border-gray-100"
                />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 bg-[#0f1423] py-12 md:py-16 px-6 sm:px-14 font-sans">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-8 mb-12 md:mb-16">
            {/* Brand Logo & Name */}
            <div className="flex flex-col gap-5 max-w-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1e2436] rounded-[14px] flex items-center justify-center text-white shadow-sm">
                  <PenLine size={24} />
                </div>
                <span className="text-[24px] font-extrabold text-white tracking-wide" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>StoryBuilder</span>
              </div>
              <p className="text-[#8B95A5] text-[14px] leading-relaxed md:pr-10">
                The collaborative story writing platform designed for creators who value structure, collaboration, and creative freedom.
              </p>
            </div>

            {/* Links Section */}
            <div className="flex gap-16 sm:gap-24 lg:gap-32">
              <div className="flex flex-col gap-4">
                <h3 className="text-white font-bold text-[14px] tracking-wide mb-1 uppercase">Platform</h3>
                <button onClick={() => navigate("/dashboard")} className="text-left text-[#8B95A5] hover:text-white transition text-[14px]">Dashboard</button>
                <button onClick={() => navigate("/main")} className="text-left text-[#8B95A5] hover:text-white transition text-[14px]">Explore</button>
                <button onClick={() => navigate("/discover")} className="text-left text-[#8B95A5] hover:text-white transition text-[14px]">Discover</button>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-white font-bold text-[14px] tracking-wide mb-1 uppercase">Company</h3>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                  className="text-left text-[#8B95A5] hover:text-white transition text-[14px]"
                >
                  About
                </button>
                <a 
                  href="mailto:viswanathpaarthiban1@gmail.com" 
                  className="text-left text-[#8B95A5] hover:text-white transition text-[14px]"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-[#1e2536] mb-8"></div>

          {/* Social & Copyright */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
            <p className="text-[#64748B] text-[13px] text-center md:text-left leading-relaxed font-medium">
              © {new Date().getFullYear()} StoryBuilder. All rights reserved.<br className="md:hidden" /> Designed for dreamers.
            </p>

            <div className="flex gap-4">
              <a href="https://github.com/SPViswanath" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1e2536] hover:bg-[#2d364f] rounded-full flex items-center justify-center transition">
                <Globe size={16} className="text-gray-300" />
              </a>
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'StoryBuilder',
                    text: 'Check out StoryBuilder, a collaborative storytelling platform!',
                    url: window.location.href,
                  });
                }
              }} className="w-10 h-10 bg-[#1e2536] hover:bg-[#2d364f] rounded-full flex items-center justify-center transition">
                <Share2 size={16} className="text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Welcome;