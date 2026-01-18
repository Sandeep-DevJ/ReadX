import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { BarChart3, Clock, BookOpen, LogOut, User, ChevronDown, Save, X } from 'lucide-react';

import { useUser } from '@/context/userContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import logoImg from '../assets/Vibrant red READX logo design.png';
import heroImg from '../assets/Futuristic workspace with warm light.png';

// --- ASSET IMPORTS ---
import cover1 from '../assets/h1st.png';  import pdf1 from '../assets/1st.pdf';
import cover2 from '../assets/h2nd.png';  import pdf2 from '../assets/2nd.pdf';
import cover3 from '../assets/h3rd.png';  import pdf3 from '../assets/3rd.pdf';
import cover4 from '../assets/h4th.png';  import pdf4 from '../assets/4th.pdf';
import cover5 from '../assets/h5th.png';  import pdf5 from '../assets/5th.pdf';

const ALL_BOOKS = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: cover1, pdf: pdf1, totalPages: 200 },
  { id: 2, title: "Atomic Habits", author: "James Clear", cover: cover2, pdf: pdf2, totalPages: 300 },
  { id: 3, title: "Deep Work", author: "Cal Newport", cover: cover3, pdf: pdf3, totalPages: 250 },
  { id: 4, title: "1984", author: "George Orwell", cover: cover4, pdf: pdf4, totalPages: 328 },
  { id: 5, title: "React Patterns", author: "Michael Chan", cover: cover5, pdf: pdf5, totalPages: 220 },
];

const WelcomePage = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // --- STATE ---
  const [stats, setStats] = useState(null);
  const [continueBooks, setContinueBooks] = useState([]);
  
  // Modal State
  const [openPdfId, setOpenPdfId] = useState(null);
  const [pageInput, setPageInput] = useState(1);
  const [notes, setNotes] = useState('');

  const accessToken = localStorage.getItem('accessToken');

  // --- LOAD STATS ---
  useEffect(() => {
    const fetchStats = async () => {
      if (!accessToken) return;

      try {
        const res = await axios.get('http://localhost:8000/api/library/stats', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (res.data.success) {
          setStats(res.data.stats);
          const merged = res.data.stats.continueReading.map(item => {
            const details = ALL_BOOKS.find(b => b.id === item.bookId);
            return { ...details, ...item };
          });
          setContinueBooks(merged);
        }
      } catch (err) {
        console.error('Stats error:', err.response?.data || err);
      }
    };

    fetchStats();
  }, [accessToken]);

  // --- PRELOAD NOTES ---
  useEffect(() => {
    if (openPdfId) {
      const b = continueBooks.find(b => b.id === openPdfId);
      setNotes(b?.notes || '');
    }
  }, [openPdfId, continueBooks]);

  // --- LOGOUT ---
  const LogoutoutHandler = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/user/logout", {}, {
        headers: { authorization: `Bearer ${accessToken}` }
      });
      if (res.data.success) {
        setUser(null);
        toast.success(res.data.message);
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // --- SAVE PROGRESS (From Modal) ---
  const handleSaveProgress = async (book) => {
    if (!accessToken) return toast.error("Please login!");
    const newPage = Number(pageInput);
    if (isNaN(newPage) || newPage < 1) return toast.error("Invalid page");

    try {
      const res = await axios.post("http://localhost:8000/api/library/update-progress", {
        bookId: book.id,
        title: book.title,
        currentPage: newPage,
        totalPages: book.totalPages,
        isFinished: newPage === book.totalPages
      }, { headers: { authorization: `Bearer ${accessToken}` } });

      if (res.data.success) {
        toast.success("Progress Saved!");
        setContinueBooks(prev => prev.map(b => b.id === book.id ? { ...b, currentPage: newPage } : b));
      }
    } catch (error) {
      toast.error("Failed to save progress");
    }
  };

  // --- SAVE NOTES (From Modal) ---
  const handleSaveNotes = async (bookId) => {
    if (!accessToken) return toast.error('Please login');
    try {
      const res = await axios.post(
        'http://localhost:8000/api/library/update-notes', 
        { bookId, notes }, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        toast.success('Notes saved');
        setContinueBooks(prev => prev.map(b => b.id === bookId ? { ...b, notes } : b));
      }
    } catch (err) { toast.error('Failed to save notes'); }
  };

  const slide = (direction) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollAmount = 350;
    container.scrollTo({ left: container.scrollLeft + (direction * scrollAmount), behavior: 'smooth' });
  };

  const goToMyLibrary = () => {
    navigate('/library', { state: { showSaved: true } });
  };

  const currentOpenBook = ALL_BOOKS.find(b => b.id === openPdfId);

  return (
    <div className="app-container bg-slate-950 text-slate-50 min-h-screen">
      <style>{`
        :root {
          --primary: #fb923c;
          --text-light: #9ca3af;
        }

        body {
          background: radial-gradient(circle at top, #020617 0%, #020617 40%, #0f172a 80%);
          color: #e5e7eb;
          overflow-x: hidden;
        }

        /* --- ANIMATIONS --- */
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          0% { opacity: 0; transform: translateY(-16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotateY(-5deg); }
          50% { transform: translateY(-10px) rotateY(-2deg); }
        }
        @keyframes glow {
          0% { box-shadow: 0 10px 30px rgba(251,146,60,0.25); }
          50% { box-shadow: 0 18px 40px rgba(251,146,60,0.45); }
          100% { box-shadow: 0 10px 30px rgba(251,146,60,0.25); }
        }

        .nav-animate { animation: fadeDown .55s ease-out both; }
        .hero-animate { animation: fadeUp .65s ease-out both; }
        .hero-animate-delayed { animation: fadeUp .7s ease-out .15s both; }
        .section-animate { animation: fadeUp .6s ease-out both; }
        .stats-animate { animation: fadeUp .6s ease-out .1s both; }

        /* NAVBAR HOVER EFFECTS */
        .main-nav {
          transition: box-shadow 0.25s ease, background-color 0.25s ease, transform 0.2s ease;
        }
        .main-nav:hover {
          box-shadow: 0 18px 45px rgba(15,23,42,0.7);
          background-color: rgba(15,23,42,0.98);
          transform: translateY(-1px);
        }
        .nav-logo-wrapper {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .main-nav:hover .nav-logo-wrapper {
          transform: translateY(-1px) scale(1.05);
          box-shadow: 0 14px 30px rgba(0,0,0,0.45);
        }

        /* nav-link underline animation */
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: width 0.2s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }

        .hero-section {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          min-height: 80vh;
          padding: 120px 5% 60px;
          align-items: center;
          gap: 60px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero-text h1 {
          font-size: 52px;
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 20px;
          color: #f9fafb;
        }
        .hero-text h1 span { color: var(--primary); }
        .hero-text p {
          font-size: 18px;
          color: var(--text-light);
          margin-bottom: 32px;
          max-width: 520px;
        }
        .hero-text h2 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #e5e7eb;
        }

        .hero-image-wrapper img {
          width: 100%;
          border-radius: 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7);
          transform: perspective(1000px) rotateY(-5deg);
          animation: float 7s ease-in-out infinite;
          transition: transform 0.5s ease, box-shadow 0.5s ease, filter 0.3s ease;
          cursor: pointer;
        }
        .hero-image-wrapper img:hover {
          transform: perspective(1000px) rotateY(0deg) translateY(-6px);
          box-shadow: 0 30px 90px rgba(0,0,0,0.9);
          filter: saturate(1.1);
        }

        .slider-section {
          padding: 70px 5% 80px;
          background: #020617;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto 32px;
        }
        .section-title {
          font-size: 30px;
          font-weight: 800;
          border-bottom: 3px solid var(--primary);
          padding-bottom: 4px;
          color: #f9fafb;
        }

        .nav-buttons button {
          background: #020617;
          border: 1px solid #1f2937;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          margin-left: 12px;
          color: #e5e7eb;
          transition: all 0.2s;
        }
        .nav-buttons button:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(251,146,60,0.5);
        }

        .slider-window {
          overflow-x: auto;
          padding: 10px 0 40px;
          scrollbar-width: none;
        }
        .slider-track {
          display: flex;
          gap: 26px;
          width: max-content;
          margin: 0 auto;
          padding: 0 5%;
        }

        .book-card {
          width: 300px;
          height: 440px;
          background: #020617;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid #1f2937;
        }
        .book-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 24px 60px rgba(0,0,0,0.95);
        }
        .book-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .book-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.95) 0%,
            rgba(0,0,0,0.25) 55%,
            rgba(0,0,0,0) 85%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .book-card:hover .book-overlay { opacity: 1; }

        .read-btn {
          background: var(--primary);
          color: white;
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 600;
          text-align: center;
          font-size: 14px;
          box-shadow: 0 14px 32px rgba(251,146,60,0.6);
        }

        .primary-btn {
          background: linear-gradient(90deg, #f97316, #fb923c);
          color: white;
          padding: 13px 32px;
          font-size: 16px;
          font-weight: 700;
          border-radius: 999px;
          cursor: pointer;
          border: none;
          outline: none;
          box-shadow: 0 14px 32px rgba(251,146,60,0.55);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          animation: glow 4s ease-in-out infinite;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 60px rgba(251,146,60,0.75);
        }
        .primary-btn:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 12px 36px rgba(251,146,60,0.6);
        }

        @media (max-width: 968px) {
          .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: 110px;
            gap: 40px;
          }
          .hero-text p { margin-left: auto; margin-right: auto; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md nav-animate main-nav">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-900 shadow flex items-center justify-center overflow-hidden nav-logo-wrapper">
              <img src={logoImg} alt="ReadX Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg tracking-tight text-slate-50">
                Read<span className="text-orange-400">X</span>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Your Personal Digital Library
              </span>
            </div>
          </Link>

          <div className="flex gap-6 items-center">
            <ul className="hidden md:flex gap-6 font-medium text-slate-300 text-sm items-center">
              <li>
                <Link
                  to="/library"
                  className="hover:text-orange-400 transition-colors nav-link"
                >
                  Library
                </Link>
              </li>
              <li>
                <Link
                  to="/category"
                  className="hover:text-orange-400 transition-colors nav-link"
                >
                  Categories
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('about');
                    el ? el.scrollIntoView({ behavior: 'smooth' }) : navigate('/#about');
                  }}
                  className="hover:text-orange-400 transition-colors nav-link"
                >
                  About
                </button>
              </li>
            </ul>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none ml-1">
                  <div className="flex items-center gap-2 border border-slate-700 rounded-full pl-3 pr-1 py-1 hover:bg-slate-900 shadow-sm transition-all">
                    <span className="text-sm font-semibold text-slate-100 hidden sm:block">
                      {user.username}
                    </span>
                    <Avatar className="h-9 w-9 border-2 border-slate-900 shadow-sm">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>
                        {user.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-slate-400 mr-1" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <div className="px-2 pb-2 text-xs text-slate-500 truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={goToMyLibrary}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Library
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={LogoutoutHandler}
                    className="text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <button className="bg-orange-500 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-orange-400 shadow-md transition-all hover:-translate-y-0.5">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-text hero-animate">
          <h2 className="text-slate-300 mb-2">Welcome Back, {user ? user.username : "Guest"}</h2>
          <h1>
            Imagination Unleashes With <span>Every Read.</span>
          </h1>
          <p>
            Discover, save & read thousands of E-books in one futuristic place.
          </p>
          <button
            className="primary-btn"
            onClick={() => navigate('/category')}
          >
            Explore Books
          </button>
        </div>
        <div className="hero-image-wrapper hero-animate-delayed">
          <img src={heroImg} alt="Workspace" />
        </div>
      </section>

      {/* STATS & CONTINUE READING */}
      {stats && (
        <section className="mt-6 mb-10 max-w-7xl mx-auto px-4 section-animate">
          <div className="bg-slate-900/80 rounded-2xl shadow-2xl border border-slate-800 p-6 md:p-7 mb-10 stats-animate">
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-slate-50">
              <BarChart3 className="text-emerald-400" /> Your Reading Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">Books Saved</p>
                <p className="text-2xl font-bold text-slate-50">{stats.totalBooks}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">Finished</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {stats.finishedBooks}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">In Progress</p>
                <p className="text-2xl font-bold text-sky-400">
                  {stats.inProgressBooks}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">Pages Read</p>
                <p className="text-2xl font-bold text-violet-400">
                  {stats.totalPagesRead}
                </p>
              </div>
            </div>
          </div>

          {continueBooks.length > 0 && (
            <>
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-slate-50">
                <Clock className="text-sky-400" /> Continue Reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {continueBooks.map(book => {
                  const progressPercent = Math.round(
                    (book.currentPage / book.totalPages) * 100
                  );
                  return (
                    <div
                      key={book.bookId}
                      className="bg-slate-900 rounded-xl shadow-md overflow-hidden border border-slate-800 flex transition-transform hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="w-28 h-36 flex-shrink-0 bg-slate-800">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3 flex flex-col">
                        <h3 className="font-semibold text-sm line-clamp-2 text-slate-50">
                          {book.title}
                        </h3>
                        <div className="mt-auto">
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>{progressPercent}%</span>
                            <span>
                              {book.currentPage}/{book.totalPages}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                            <div
                              className="h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <button
                            onClick={() => {
                              setOpenPdfId(book.bookId);
                              setPageInput(book.currentPage);
                            }}
                            className="w-full text-xs py-1.5 rounded-md bg-emerald-500 text-white flex items-center justify-center gap-1 hover:bg-emerald-400 transition-colors"
                          >
                            <BookOpen size={14} /> Open
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}

      {/* SLIDER SECTION */}
      <section id="latest" className="slider-section section-animate">
        <div className="section-header max-w-7xl mx-auto">
          <h3 className="section-title">Latest Editions</h3>
          <div className="nav-buttons">
            <button onClick={() => slide(-1)}>❮</button>
            <button onClick={() => slide(1)}>❯</button>
          </div>
        </div>
        <div className="slider-window" ref={sliderRef}>
          <div className="slider-track">
            {ALL_BOOKS.slice(0, 5).map((book) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => {
                  setOpenPdfId(book.id);
                  setPageInput(1);
                }}
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="book-cover-img"
                />
                <div className="book-overlay">
                  <div className="read-btn">Read Now</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 bg-slate-950 section-animate border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-50">
            About <span className="text-orange-400">ReadX</span>
          </h2>
          <p className="text-slate-300">
            ReadX is your personal digital library, designed to make reading
            simple, organized, and engaging.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-0 border-t border-slate-900 bg-slate-950 section-animate">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-50">
                Ready to explore more?
              </h3>
            </div>
            <button
              className="primary-btn"
              onClick={() => navigate('/category')}
            >
              Browse Full Library
            </button>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="font-semibold text-slate-100">
                Read<span className="text-orange-400">X</span>
              </span>{" "}
              © {new Date().getFullYear()}
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <button
                onClick={() =>
                  document
                    .getElementById('about')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="hover:text-orange-400 transition-colors"
              >
                About
              </button>
              <button
                onClick={goToMyLibrary}
                className="hover:text-orange-400 transition-colors"
              >
                My Library
              </button>
              <Link
                to="/category"
                className="hover:text-orange-400 transition-colors"
              >
                Categories
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODAL FOR READING --- */}
      {openPdfId && currentOpenBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-950 w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-slate-800">
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg text-slate-50">
                  {currentOpenBook.title}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                {accessToken && (
                  <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-slate-100">
                      Page:
                    </span>
                    <input
                      type="number"
                      className="w-12 bg-slate-950 border border-slate-700 rounded p-1 text-center text-sm text-slate-50"
                      value={pageInput}
                      onChange={(e) => setPageInput(e.target.value)}
                    />
                    <span className="text-sm text-slate-400">
                      / {currentOpenBook.totalPages}
                    </span>
                    <button
                      onClick={() => handleSaveProgress(currentOpenBook)}
                      className="bg-sky-600 text-white p-1.5 rounded hover:bg-sky-500 transition-colors"
                    >
                      <Save size={14} />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setOpenPdfId(null)}
                  className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-3 bg-slate-900 flex gap-2 items-start border-b border-slate-800">
              <textarea
                className="flex-1 border border-slate-700 rounded-md p-2 text-sm bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                rows={1}
                placeholder="Book notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <button
                onClick={() => handleSaveNotes(currentOpenBook.id)}
                className="px-3 py-2 bg-purple-600 text-white rounded-md text-xs hover:bg-purple-500 transition-colors shadow-sm"
              >
                Save Notes
              </button>
            </div>
            <div className="flex-1 bg-slate-900 relative">
              <iframe
                key={`${openPdfId}-${pageInput}`}
                src={`${currentOpenBook.pdf}#page=${pageInput}&toolbar=0`}
                className="w-full h-full absolute inset-0"
                title={currentOpenBook.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;