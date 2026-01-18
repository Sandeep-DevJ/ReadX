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
      // Find book in continueBooks to see if we have notes
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
        // Update local stats to reflect change immediately
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
      const res = await axios.post('http://localhost:8000/api/library/update-notes', 
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
    <div className="app-container">
      <style>{`
        :root { --primary: #ff4b1f; --text-light: #636e72; }
        body { background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); color: #2d3436; overflow-x: hidden; }
        .hero-section { display: grid; grid-template-columns: 1.1fr 0.9fr; min-height: 80vh; padding: 120px 5% 60px; align-items: center; gap: 60px; max-width: 1200px; margin: 0 auto; }
        .hero-text h1 { font-size: 52px; line-height: 1.1; font-weight: 800; margin-bottom: 20px; color: #2d3436; }
        .hero-text h1 span { color: var(--primary); }
        .hero-text p { font-size: 18px; color: var(--text-light); margin-bottom: 32px; max-width: 520px; }
        .hero-image-wrapper img { width: 100%; border-radius: 28px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); transform: perspective(1000px) rotateY(-5deg); transition: transform 0.5s ease; }
        .hero-image-wrapper img:hover { transform: perspective(1000px) rotateY(0deg); }
        .slider-section { padding: 70px 5% 80px; background: white; }
        .section-header { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto 32px; }
        .section-title { font-size: 30px; font-weight: 800; border-bottom: 3px solid var(--primary); padding-bottom: 4px; }
        .nav-buttons button { background: white; border: 1px solid #eee; width: 46px; height: 46px; border-radius: 50%; font-size: 20px; cursor: pointer; margin-left: 12px; transition: all 0.2s; }
        .nav-buttons button:hover { background: var(--primary); color: white; }
        .slider-window { overflow-x: auto; padding: 10px 0 40px; scrollbar-width: none; }
        .slider-track { display: flex; gap: 26px; width: max-content; margin: 0 auto; padding: 0 5%; }
        .book-card { width: 300px; height: 440px; background: white; border-radius: 18px; position: relative; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08); transition: all 0.3s ease; cursor: pointer; }
        .book-card:hover { transform: translateY(-10px); box-shadow: 0 18px 36px rgba(255, 75, 31, 0.18); }
        .book-cover-img { width: 100%; height: 100%; object-fit: cover; }
        .book-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 24px; opacity: 0; transition: opacity 0.25s ease; }
        .book-card:hover .book-overlay { opacity: 1; }
        .read-btn { background: var(--primary); color: white; padding: 10px 16px; border-radius: 999px; font-weight: 600; text-align: center; font-size: 14px; }
        .primary-btn { background: linear-gradient(90deg, #ff4b1f, #ff9068); color: white; padding: 13px 32px; font-size: 16px; font-weight: 700; border-radius: 999px; cursor: pointer; }
        @media (max-width: 968px) { .hero-section { grid-template-columns: 1fr; text-align: center; padding-top: 110px; gap: 40px; } }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-200/60 bg-white/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
              <img src={logoImg} alt="ReadX Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg tracking-tight text-gray-900">Read<span className="text-[#ff4b1f]">X</span></span>
              <span className="text-[11px] text-gray-500 hidden sm:block">Your Personal Digital Library</span>
            </div>
          </Link>

          <div className="flex gap-6 items-center">
            <ul className="hidden md:flex gap-6 font-medium text-gray-600 text-sm items-center">
              <li><Link to="/library" className="hover:text-[#ff4b1f]">Library</Link></li>
              <li><Link to="/category" className="hover:text-[#ff4b1f]">Categories</Link></li>
              <li><button onClick={() => { const el = document.getElementById('about'); el ? el.scrollIntoView({ behavior: 'smooth' }) : navigate('/#about'); }} className="hover:text-[#ff4b1f]">About</button></li>
            </ul>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none ml-1">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-full pl-3 pr-1 py-1 hover:bg-gray-50">
                    <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user.username}</span>
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm"><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-400 mr-1" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <div className="px-2 pb-2 text-xs text-gray-500 truncate">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={goToMyLibrary}><BookOpen className="mr-2 h-4 w-4" />My Library</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={LogoutoutHandler} className="text-red-600"><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login"><button className="bg-[#ff4b1f] text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-[#d63005]">Login</button></Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-text">
          <h2>Welcome Back, {user ? user.username : "Guest"}</h2>
          <h1>Imagination Unleashes With <span>Every Read.</span></h1>
          <p>Discover, save & read thousands of E-books in one futuristic place.</p>
          <button className="primary-btn" onClick={() => navigate('/category')}>Explore Books</button>
        </div>
        <div className="hero-image-wrapper"><img src={heroImg} alt="Workspace" /></div>
      </section>

      {/* STATS & CONTINUE READING */}
      {stats && (
        <section className="mt-6 mb-10 max-w-7xl mx-auto px-4">
          <div className="bg-white/90 rounded-2xl shadow-lg p-6 md:p-7 mb-10">
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 className="text-green-600" /> Your Reading Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-gray-50"><p className="text-xs text-gray-500">Books Saved</p><p className="text-2xl font-bold">{stats.totalBooks}</p></div>
              <div className="p-3 rounded-lg bg-gray-50"><p className="text-xs text-gray-500">Finished</p><p className="text-2xl font-bold text-green-600">{stats.finishedBooks}</p></div>
              <div className="p-3 rounded-lg bg-gray-50"><p className="text-xs text-gray-500">In Progress</p><p className="text-2xl font-bold text-blue-600">{stats.inProgressBooks}</p></div>
              <div className="p-3 rounded-lg bg-gray-50"><p className="text-xs text-gray-500">Pages Read</p><p className="text-2xl font-bold text-purple-600">{stats.totalPagesRead}</p></div>
            </div>
          </div>

          {continueBooks.length > 0 && (
            <>
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2"><Clock className="text-blue-600" /> Continue Reading</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {continueBooks.map(book => {
                  const progressPercent = Math.round((book.currentPage / book.totalPages) * 100);
                  return (
                    <div key={book.bookId} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex">
                      <div className="w-28 h-36 flex-shrink-0 bg-gray-200"><img src={book.cover} alt={book.title} className="w-full h-full object-cover" /></div>
                      <div className="flex-1 p-3 flex flex-col">
                        <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
                        <div className="mt-auto">
                          <div className="flex justify-between text-[11px] text-gray-500 mb-1"><span>{progressPercent}%</span><span>{book.currentPage}/{book.totalPages}</span></div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2"><div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${progressPercent}%` }} /></div>
                          <button onClick={() => { setOpenPdfId(book.bookId); setPageInput(book.currentPage); }} className="w-full text-xs py-1.5 rounded-md bg-green-500 text-white flex items-center justify-center gap-1 hover:bg-green-600"><BookOpen size={14} /> Open</button>
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
      <section id="latest" className="slider-section">
        <div className="section-header max-w-7xl mx-auto"><h3 className="section-title">Latest Editions</h3><div className="nav-buttons"><button onClick={() => slide(-1)}>❮</button><button onClick={() => slide(1)}>❯</button></div></div>
        <div className="slider-window" ref={sliderRef}>
          <div className="slider-track">
            {ALL_BOOKS.slice(0, 5).map((book) => (
              <div key={book.id} className="book-card" onClick={() => { setOpenPdfId(book.id); setPageInput(1); }}>
                <img src={book.cover} alt={book.title} className="book-cover-img" />
                <div className="book-overlay"><div className="read-btn">Read Now</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">About <span className="text-[#ff4b1f]">ReadX</span></h2>
          <p className="text-gray-600">ReadX is your personal digital library, designed to make reading simple, organized, and engaging.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-0 border-t border-gray-200/60 bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="text-center md:text-left"><h3 className="text-xl font-bold text-gray-900">Ready to explore more?</h3></div>
            <button className="primary-btn" onClick={() => navigate('/category')}>Browse Full Library</button>
          </div>
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Read<span className="text-[#ff4b1f]">X</span></span> © {new Date().getFullYear()}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#ff4b1f]">About</button>
              <button onClick={goToMyLibrary} className="hover:text-[#ff4b1f]">My Library</button>
              <Link to="/category" className="hover:text-[#ff4b1f]">Categories</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODAL FOR READING --- */}
      {openPdfId && currentOpenBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-white p-4 border-b flex justify-between items-center shadow-sm z-10">
              <div><h2 className="font-bold text-lg text-gray-800">{currentOpenBook.title}</h2></div>
              <div className="flex items-center gap-4">
                {accessToken && (
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Page:</span>
                    <input type="number" className="w-12 bg-white border border-gray-300 rounded p-1 text-center text-sm" value={pageInput} onChange={(e) => setPageInput(e.target.value)} />
                    <span className="text-sm text-gray-400">/ {currentOpenBook.totalPages}</span>
                    <button onClick={() => handleSaveProgress(currentOpenBook)} className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700"><Save size={14} /></button>
                  </div>
                )}
                <button onClick={() => setOpenPdfId(null)} className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full"><X size={24} /></button>
              </div>
            </div>
            <div className="p-3 bg-gray-50 flex gap-2 items-start border-b">
              <textarea className="flex-1 border rounded-md p-2 text-sm" rows={1} placeholder="Book notes..." value={notes} onChange={e => setNotes(e.target.value)} />
              <button onClick={() => handleSaveNotes(currentOpenBook.id)} className="px-3 py-2 bg-purple-600 text-white rounded-md text-xs hover:bg-purple-700">Save Notes</button>
            </div>
            <div className="flex-1 bg-gray-100 relative">
              <iframe key={`${openPdfId}-${pageInput}`} src={`${currentOpenBook.pdf}#page=${pageInput}&toolbar=0`} className="w-full h-full absolute inset-0" title={currentOpenBook.title} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;