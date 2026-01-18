import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Search, BookOpen, ChevronRight, ChevronLeft, Plus, CheckCircle2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ================= ASSET IMPORTS =================

// --- Series 1-10 (Programming) ---
import cover1 from '../assets/h1st.png';  import pdf1 from '../assets/1st.pdf';
import cover2 from '../assets/h2nd.png';  import pdf2 from '../assets/2nd.pdf';
import cover3 from '../assets/h3rd.png';  import pdf3 from '../assets/3rd.pdf';
import cover4 from '../assets/h4th.png';  import pdf4 from '../assets/4th.pdf';
import cover5 from '../assets/h5th.png';  import pdf5 from '../assets/5th.pdf';
import cover6 from '../assets/6th.png';   import pdf6 from '../assets/6th.pdf';
import cover7 from '../assets/7th.png';   import pdf7 from '../assets/7th.pdf';
import cover8 from '../assets/8th.png';   import pdf8 from '../assets/8th.pdf';
import cover9 from '../assets/9th.png';   import pdf9 from '../assets/9th.pdf';
import cover10 from '../assets/10th.png'; import pdf10 from '../assets/10th.pdf';

// --- Series C (Comics) ---
import coverC1 from '../assets/c1.png';   import pdfC1 from '../assets/C1.pdf';
import coverC2 from '../assets/c2.png';   import pdfC2 from '../assets/C2.pdf';
import coverC3 from '../assets/c3.png';   import pdfC3 from '../assets/C3.pdf';
import coverC4 from '../assets/c4.png';   import pdfC4 from '../assets/C4.pdf';
import coverC5 from '../assets/c5.png';   import pdfC5 from '../assets/C5.pdf';
import coverC6 from '../assets/c6.png';   import pdfC6 from '../assets/C6.pdf';
import coverC7 from '../assets/c7.png';   import pdfC7 from '../assets/C7.pdf';
import coverC8 from '../assets/c8.png';   import pdfC8 from '../assets/C8.pdf';
import coverC9 from '../assets/c9.png';   import pdfC9 from '../assets/C9.pdf';
import coverC10 from '../assets/c10.png'; import pdfC10 from '../assets/C10.pdf';

// --- Series S (Self-Help) ---
import coverS1 from '../assets/s1.png';   import pdfS1 from '../assets/1st.pdf'; // Placeholder
import coverS2 from '../assets/s2.png';   import pdfS2 from '../assets/s2.pdf';
import coverS3 from '../assets/s3.png';   import pdfS3 from '../assets/s3.pdf';
import coverS4 from '../assets/s4.png';   import pdfS4 from '../assets/s4.pdf';
import coverS5 from '../assets/s5.png';   import pdfS5 from '../assets/s5.pdf';
import coverS6 from '../assets/s6.png';   import pdfS6 from '../assets/s6.pdf';
import coverS7 from '../assets/s7.png';   import pdfS7 from '../assets/s7.pdf';
import coverS8 from '../assets/s8.png';   import pdfS8 from '../assets/s8.pdf';
import coverS9 from '../assets/s9.png';   import pdfS9 from '../assets/s9.pdf';
import coverS10 from '../assets/s10.png'; import pdfS10 from '../assets/s10.pdf';

// --- Series SC (Science) ---
import coverSC1 from '../assets/sc1.jpg'; import pdfSC1 from '../assets/sc1.pdf';
import coverSC2 from '../assets/sc2.png'; import pdfSC2 from '../assets/sc2.pdf';
import coverSC3 from '../assets/sc3.png'; import pdfSC3 from '../assets/sc3.pdf';
import coverSC4 from '../assets/sc4.png'; import pdfSC4 from '../assets/sc4.pdf';
import coverSC5 from '../assets/sc5.png'; import pdfSC5 from '../assets/sc5.pdf';
import coverSC6 from '../assets/sc6.png'; import pdfSC6 from '../assets/sc6.pdf';
import coverSC7 from '../assets/sc7.png'; import pdfSC7 from '../assets/sc7.pdf';
import coverSC8 from '../assets/sc8.png'; import pdfSC8 from '../assets/sc8.pdf';

// ================= BOOK DATABASE =================
const ALL_BOOKS = [
  // Programming
  { id: 1, title: "C++ Programming", author: "Tech Series", category: "Programming", cover: cover1, pdf: pdf1, totalPages: 200 },
  { id: 2, title: "Advanced C++", author: "Tech Series", category: "Programming", cover: cover2, pdf: pdf2, totalPages: 300 },
  { id: 3, title: "Data Structures", author: "Tech Series", category: "Programming", cover: cover3, pdf: pdf3, totalPages: 250 },
  { id: 4, title: "Algorithms", author: "Tech Series", category: "Programming", cover: cover4, pdf: pdf4, totalPages: 328 },
  { id: 5, title: "Web Development", author: "Tech Series", category: "Programming", cover: cover5, pdf: pdf5, totalPages: 220 },
  { id: 6, title: "Java Basics", author: "Tech Series", category: "Programming", cover: cover6, pdf: pdf6, totalPages: 350 },
  { id: 7, title: "Python Guide", author: "Tech Series", category: "Programming", cover: cover7, pdf: pdf7, totalPages: 460 },
  { id: 8, title: "React JS", author: "Tech Series", category: "Programming", cover: cover8, pdf: pdf8, totalPages: 499 },
  { id: 9, title: "Node JS", author: "Tech Series", category: "Programming", cover: cover9, pdf: pdf9, totalPages: 440 },
  { id: 10, title: "Database Design", author: "Tech Series", category: "Programming", cover: cover10, pdf: pdf10, totalPages: 180 },

  // Comics
  { id: 11, title: "Comic Vol 1", author: "Comic World", category: "Comics", cover: coverC1, pdf: pdfC1, totalPages: 100 },
  { id: 12, title: "Comic Vol 2", author: "Comic World", category: "Comics", cover: coverC2, pdf: pdfC2, totalPages: 100 },
  { id: 13, title: "Comic Vol 3", author: "Comic World", category: "Comics", cover: coverC3, pdf: pdfC3, totalPages: 100 },
  { id: 14, title: "Comic Vol 4", author: "Comic World", category: "Comics", cover: coverC4, pdf: pdfC4, totalPages: 100 },
  { id: 15, title: "Comic Vol 5", author: "Comic World", category: "Comics", cover: coverC5, pdf: pdfC5, totalPages: 100 },
  { id: 16, title: "Comic Vol 6", author: "Comic World", category: "Comics", cover: coverC6, pdf: pdfC6, totalPages: 100 },
  { id: 17, title: "Comic Vol 7", author: "Comic World", category: "Comics", cover: coverC7, pdf: pdfC7, totalPages: 100 },
  { id: 18, title: "Comic Vol 8", author: "Comic World", category: "Comics", cover: coverC8, pdf: pdfC8, totalPages: 100 },
  { id: 19, title: "Comic Vol 9", author: "Comic World", category: "Comics", cover: coverC9, pdf: pdfC9, totalPages: 100 },
  { id: 20, title: "Comic Vol 10", author: "Comic World", category: "Comics", cover: coverC10, pdf: pdfC10, totalPages: 100 },

  // Self-Help
  { id: 21, title: "Mindset", author: "Life Coach", category: "Self-Help", cover: coverS1, pdf: pdfS1, totalPages: 380 },
  { id: 22, title: "Growth", author: "Life Coach", category: "Self-Help", cover: coverS2, pdf: pdfS2, totalPages: 256 },
  { id: 23, title: "Focus", author: "Life Coach", category: "Self-Help", cover: coverS3, pdf: pdfS3, totalPages: 360 },
  { id: 24, title: "Discipline", author: "Life Coach", category: "Self-Help", cover: coverS4, pdf: pdfS4, totalPages: 220 },
  { id: 25, title: "Power", author: "Life Coach", category: "Self-Help", cover: coverS5, pdf: pdfS5, totalPages: 400 },
  { id: 26, title: "Energy", author: "Life Coach", category: "Self-Help", cover: coverS6, pdf: pdfS6, totalPages: 600 },
  { id: 27, title: "Habits", author: "Life Coach", category: "Self-Help", cover: coverS7, pdf: pdfS7, totalPages: 480 },
  { id: 28, title: "Sleep", author: "Life Coach", category: "Self-Help", cover: coverS8, pdf: pdfS8, totalPages: 360 },
  { id: 29, title: "Breath", author: "Life Coach", category: "Self-Help", cover: coverS9, pdf: pdfS9, totalPages: 300 },
  { id: 30, title: "Body", author: "Life Coach", category: "Self-Help", cover: coverS10, pdf: pdfS10, totalPages: 450 },

  // Science
  { id: 31, title: "Physics 101", author: "Science Hub", category: "Science", cover: coverSC1, pdf: pdfSC1, totalPages: 320 },
  { id: 32, title: "Chemistry", author: "Science Hub", category: "Science", cover: coverSC2, pdf: pdfSC2, totalPages: 210 },
  { id: 33, title: "Biology", author: "Science Hub", category: "Science", cover: coverSC3, pdf: pdfSC3, totalPages: 400 },
  { id: 34, title: "Astronomy", author: "Science Hub", category: "Science", cover: coverSC4, pdf: pdfSC4, totalPages: 200 },
  { id: 35, title: "Geology", author: "Science Hub", category: "Science", cover: coverSC5, pdf: pdfSC5, totalPages: 600 },
  { id: 36, title: "Ecology", author: "Science Hub", category: "Science", cover: coverSC6, pdf: pdfSC6, totalPages: 240 },
  { id: 37, title: "Zoology", author: "Science Hub", category: "Science", cover: coverSC7, pdf: pdfSC7, totalPages: 300 },
  { id: 38, title: "Botany", author: "Science Hub", category: "Science", cover: coverSC8, pdf: pdfSC8, totalPages: 280 },
];

const CATEGORY_SECTIONS = [
  { id: 'programming', title: 'Programming Language', filter: 'Programming', color: 'from-blue-500 to-cyan-400' },
  { id: 'comics', title: 'Comic Books', filter: 'Comics', color: 'from-purple-500 to-pink-400' },
  { id: 'self-help', title: 'Empower Yourself', filter: 'Self-Help', color: 'from-orange-500 to-red-400' },
  { id: 'science', title: 'Science & Fantasy', filter: 'Science', color: 'from-green-500 to-emerald-400' },
];

const CategoryPage = () => {
  const navigate = useNavigate();
  const [savedBookIds, setSavedBookIds] = useState([]);
  const [openPdfId, setOpenPdfId] = useState(null);
  const [pageInput, setPageInput] = useState(1);
  
  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUserLibrary = async () => {
      if (!isLoggedIn) return;
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8000/api/library/my-library", {
          headers: { authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          const ids = res.data.userProgress.map(item => item.bookId);
          setSavedBookIds(ids);
        }
      } catch (error) {
        console.error("Library fetch error", error);
      }
    };
    fetchUserLibrary();
  }, [isLoggedIn]);

  const handleOpenBook = async (book) => {
    setOpenPdfId(book.id);
    setPageInput(1);

    if (isLoggedIn) {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8000/api/library/my-library", {
          headers: { authorization: `Bearer ${token}` }
        });
        if(res.data.success) {
          const savedBook = res.data.userProgress.find(p => p.bookId === book.id);
          if(savedBook && savedBook.currentPage > 0) {
            setPageInput(savedBook.currentPage);
          }
        }
      } catch(e) {
        console.error(e);
      }
    }
  };

  const handleAddToLibrary = async (book) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return toast.error("Please login to save books!");

    try {
      const res = await axios.post("http://localhost:8000/api/library/add-to-library", {
        bookId: book.id, title: book.title, totalPages: book.totalPages
      }, { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } });

      if (res.data.success) {
        toast.success("Added to Library!");
        setSavedBookIds(prev => [...prev, book.id]);
      }
    } catch (error) {
      toast.error("Failed to add book");
    }
  };

  const handleSaveProgress = async (book, pageOverride) => {
    if (!isLoggedIn) return toast.error("Please login!");
    const newPage = Number(pageOverride ?? pageInput);
    if (isNaN(newPage) || newPage < 1) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post("http://localhost:8000/api/library/update-progress", {
        bookId: book.id, title: book.title, currentPage: newPage, 
        totalPages: book.totalPages, isFinished: newPage === book.totalPages
      }, { headers: { authorization: `Bearer ${token}` } });
      
      toast.success("Progress Saved!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save progress");
    }
  };

  const currentOpenBook = ALL_BOOKS.find(b => b.id === openPdfId);

  const scrollRow = (id, direction) => {
    const container = document.getElementById(id);
    if(container) {
      const scrollAmount = 300;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20">
      {/* HERO */}
      <div className="relative bg-slate-950 text-slate-50 py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src={cover5} className="w-full h-full object-cover blur-md" alt="Background" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
        <div className="relative max-w-6xl mx-auto z-10 text-center">
          <button
            onClick={() => navigate('/')}
            className="absolute top-[-60px] left-0 text-slate-400 hover:text-slate-100 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft size={20} /> Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-5xl font-extrabold italic font-serif leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
            "Focus more on your desire than on your doubt,<br/>and the dream will take care of itself."
          </h1>
          <p className="text-slate-400 mt-4 text-sm font-medium tracking-widest uppercase">
            — Mark Twain
          </p>
        </div>
      </div>

      {/* QUICK NAV */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto no-scrollbar">
          {CATEGORY_SECTIONS.map(section => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="whitespace-nowrap px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-slate-200 transition-all hover:scale-105 border border-slate-800"
            >
              {section.title}
            </a>
          ))}
        </div>
      </div>

      {/* CATEGORY ROWS */}
      <div className="max-w-[1600px] mx-auto px-4 py-10 space-y-16">
        {CATEGORY_SECTIONS.map((section) => {
          const sectionBooks = ALL_BOOKS.filter(b => b.category === section.filter);
          return (
            <div key={section.id} id={section.id} className="relative group">
              <div className="flex items-center gap-4 mb-6">
                <div className={`h-8 w-1.5 rounded-full bg-gradient-to-b ${section.color}`} />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-50">
                  {section.title}
                </h2>
                <span className="text-slate-500 text-sm ml-auto hidden md:inline-block">
                  Swipe to see more →
                </span>
              </div>

              <button
                onClick={() => scrollRow(`row-${section.id}`, 'left')}
                className="absolute left-0 top-[55%] -translate-y-1/2 z-20 bg-slate-950/90 p-3 rounded-full shadow-2xl hover:bg-slate-900 hover:scale-110 transition-all hidden group-hover:block border border-slate-700 text-slate-200"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scrollRow(`row-${section.id}`, 'right')}
                className="absolute right-0 top-[55%] -translate-y-1/2 z-20 bg-slate-950/90 p-3 rounded-full shadow-2xl hover:bg-slate-900 hover:scale-110 transition-all hidden group-hover:block border border-slate-700 text-slate-200"
              >
                <ChevronRight size={24} />
              </button>

              <div
                id={`row-${section.id}`}
                className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 scroll-smooth no-scrollbar"
              >
                {sectionBooks.map(book => (
                  <div
                    key={book.id}
                    className="flex-shrink-0 w-[220px] bg-slate-900 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-slate-800 relative group/card"
                  >
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      {savedBookIds.includes(book.id) ? (
                        <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                          <CheckCircle2 size={16} />
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddToLibrary(book); }}
                          className="bg-slate-900 text-slate-100 p-1.5 rounded-full shadow-lg hover:bg-sky-500 hover:text-white transition-colors"
                          title="Add to Library"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>

                    <div className="h-[320px] w-full bg-slate-800 relative overflow-hidden">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenBook(book)}
                          className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold hover:bg-sky-500 hover:text-white transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                          <BookOpen size={18} /> Read Now
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-slate-50 text-lg truncate">
                        {book.title}
                      </h3>
                      <p className="text-slate-400 text-sm">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* PDF MODAL */}
      {openPdfId && currentOpenBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-slate-950 w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-slate-800">
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg text-slate-50">
                  {currentOpenBook.title}
                </h2>
                <p className="text-xs text-slate-400">
                  {currentOpenBook.author}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {isLoggedIn && (
                  <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
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
                      title="Save Progress"
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

export default CategoryPage;