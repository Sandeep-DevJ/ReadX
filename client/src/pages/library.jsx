import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Search, BookOpen, Clock, Save, CheckCircle2, X, Plus, Trash2 } from 'lucide-react';

// ================= ASSET IMPORTS =================

// --- Series 1-5 (Confirmed) ---
import cover1 from '../assets/h1st.png';  import pdf1 from '../assets/1st.pdf';
import cover2 from '../assets/h2nd.png';  import pdf2 from '../assets/2nd.pdf';
import cover3 from '../assets/h3rd.png';  import pdf3 from '../assets/3rd.pdf';
import cover4 from '../assets/h4th.png';  import pdf4 from '../assets/4th.pdf';
import cover5 from '../assets/h5th.png';  import pdf5 from '../assets/5th.pdf';

// --- Series 6-10 ---
import cover6 from '../assets/6th.png';   import pdf6 from '../assets/6th.pdf';
import cover7 from '../assets/7th.png';   import pdf7 from '../assets/7th.pdf';
import cover8 from '../assets/8th.png';   import pdf8 from '../assets/8th.pdf';
import cover9 from '../assets/9th.png';   import pdf9 from '../assets/9th.pdf';
import cover10 from '../assets/10th.png'; import pdf10 from '../assets/10th.pdf';

// --- Series C (Tech) ---
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

// --- Series S (Science) ---
import coverS1 from '../assets/s1.png';
import pdfS1 from '../assets/1st.pdf';

import coverS2 from '../assets/s2.png';   import pdfS2 from '../assets/s2.pdf';
import coverS3 from '../assets/s3.png';   import pdfS3 from '../assets/s3.pdf';
import coverS4 from '../assets/s4.png';   import pdfS4 from '../assets/s4.pdf';
import coverS5 from '../assets/s5.png';   import pdfS5 from '../assets/s5.pdf';
import coverS6 from '../assets/s6.png';   import pdfS6 from '../assets/s6.pdf';
import coverS7 from '../assets/s7.png';   import pdfS7 from '../assets/s7.pdf';
import coverS8 from '../assets/s8.png';   import pdfS8 from '../assets/s8.pdf';
import coverS9 from '../assets/s9.png';   import pdfS9 from '../assets/s9.pdf';
import coverS10 from '../assets/s10.png'; import pdfS10 from '../assets/s10.pdf';

// --- Series SC (Classics) ---
import coverSC1 from '../assets/sc1.jpg'; import pdfSC1 from '../assets/sc1.pdf';
import coverSC2 from '../assets/sc2.png'; import pdfSC2 from '../assets/sc2.pdf';
import coverSC3 from '../assets/sc3.png'; import pdfSC3 from '../assets/sc3.pdf';
import coverSC4 from '../assets/sc4.png'; import pdfSC4 from '../assets/sc4.pdf';
import coverSC5 from '../assets/sc5.png'; import pdfSC5 from '../assets/sc5.pdf';
import coverSC6 from '../assets/sc6.png'; import pdfSC6 from '../assets/sc6.pdf';

// ================= BOOK DATABASE =================
const ALL_BOOKS = [
  // Original 1-5
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", cover: cover1, pdf: pdf1, totalPages: 200 },
  { id: 2, title: "Atomic Habits", author: "James Clear", category: "Self-Help", cover: cover2, pdf: pdf2, totalPages: 300 },
  { id: 3, title: "Deep Work", author: "Cal Newport", category: "Productivity", cover: cover3, pdf: pdf3, totalPages: 250 },
  { id: 4, title: "1984", author: "George Orwell", category: "Classic", cover: cover4, pdf: pdf4, totalPages: 328 },
  { id: 5, title: "React Patterns", author: "Michael Chan", category: "Tech", cover: cover5, pdf: pdf5, totalPages: 220 },

  // 6-10
  { id: 6, title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Tech", cover: cover6, pdf: pdf6, totalPages: 350 },
  { id: 7, title: "Clean Code", author: "Robert C. Martin", category: "Tech", cover: cover7, pdf: pdf7, totalPages: 460 },
  { id: 8, title: "Thinking Fast and Slow", author: "Daniel Kahneman", category: "Psychology", cover: cover8, pdf: pdf8, totalPages: 499 },
  { id: 9, title: "Sapiens", author: "Yuval Noah Harari", category: "History", cover: cover9, pdf: pdf9, totalPages: 440 },
  { id: 10, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", cover: cover10, pdf: pdf10, totalPages: 180 },

  // C series
  { id: 11, title: "C++ Primer", author: "Stanley Lippman", category: "Tech", cover: coverC1, pdf: pdfC1, totalPages: 900 },
  { id: 12, title: "Effective Modern C++", author: "Scott Meyers", category: "Tech", cover: coverC2, pdf: pdfC2, totalPages: 300 },
  { id: 13, title: "The C Programming Language", author: "Brian Kernighan", category: "Tech", cover: coverC3, pdf: pdfC3, totalPages: 280 },
  { id: 14, title: "C# in Depth", author: "Jon Skeet", category: "Tech", cover: coverC4, pdf: pdfC4, totalPages: 500 },
  { id: 15, title: "Head First C#", author: "Andrew Stellman", category: "Tech", cover: coverC5, pdf: pdfC5, totalPages: 600 },
  { id: 16, title: "Programming in C", author: "Stephen Kochan", category: "Tech", cover: coverC6, pdf: pdfC6, totalPages: 400 },
  { id: 17, title: "C++ Concurrency", author: "Anthony Williams", category: "Tech", cover: coverC7, pdf: pdfC7, totalPages: 350 },
  { id: 18, title: "Expert C Programming", author: "Peter van der Linden", category: "Tech", cover: coverC8, pdf: pdfC8, totalPages: 380 },
  { id: 19, title: "C Pointers", author: "Kenneth Reek", category: "Tech", cover: coverC9, pdf: pdfC9, totalPages: 250 },
  { id: 20, title: "Accelerated C++", author: "Andrew Koenig", category: "Tech", cover: coverC10, pdf: pdfC10, totalPages: 300 },

  // S series
  { id: 21, title: "Cosmos", author: "Carl Sagan", category: "Science", cover: coverS1, pdf: pdfS1, totalPages: 380 },
  { id: 22, title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", cover: coverS2, pdf: pdfS2, totalPages: 256 },
  { id: 23, title: "The Selfish Gene", author: "Richard Dawkins", category: "Science", cover: coverS3, pdf: pdfS3, totalPages: 360 },
  { id: 24, title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", category: "Science", cover: coverS4, pdf: pdfS4, totalPages: 220 },
  { id: 25, title: "Silent Spring", author: "Rachel Carson", category: "Science", cover: coverS5, pdf: pdfS5, totalPages: 400 },
  { id: 26, title: "The Gene", author: "Siddhartha Mukherjee", category: "Science", cover: coverS6, pdf: pdfS6, totalPages: 600 },
  { id: 27, title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "History", cover: coverS7, pdf: pdfS7, totalPages: 480 },
  { id: 28, title: "Why We Sleep", author: "Matthew Walker", category: "Health", cover: coverS8, pdf: pdfS8, totalPages: 360 },
  { id: 29, title: "Breath", author: "James Nestor", category: "Health", cover: coverS9, pdf: pdfS9, totalPages: 300 },
  { id: 30, title: "The Body", author: "Bill Bryson", category: "Science", cover: coverS10, pdf: pdfS10, totalPages: 450 },

  // SC series
  { id: 31, title: "Physics of the Impossible", author: "Michio Kaku", category: "Science", cover: coverSC1, pdf: pdfSC1, totalPages: 320 },
  { id: 32, title: "Structure of Scientific Revolutions", author: "Thomas Kuhn", category: "Academic", cover: coverSC2, pdf: pdfSC2, totalPages: 210 },
  { id: 33, title: "The Republic", author: "Plato", category: "Classic", cover: coverSC3, pdf: pdfSC3, totalPages: 400 },
  { id: 34, title: "Meditations", author: "Marcus Aurelius", category: "Classic", cover: coverSC4, pdf: pdfSC4, totalPages: 200 },
  { id: 35, title: "Critique of Pure Reason", author: "Immanuel Kant", category: "Classic", cover: coverSC5, pdf: pdfSC5, totalPages: 600 },
  { id: 36, title: "Beyond Good and Evil", author: "Friedrich Nietzsche", category: "Classic", cover: coverSC6, pdf: pdfSC6, totalPages: 240 },
];

const LibraryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navOpenBookId = location.state?.openBookId || null;
  const navJumpToPage = location.state?.jumpToPage || null;

  const [books, setBooks] = useState(
    ALL_BOOKS.map(b => ({ ...b, progress: 0, currentPage: 1 }))
  );
  const [savedBookIds, setSavedBookIds] = useState([]);
  const [openPdfId, setOpenPdfId] = useState(null);
  const [pageInput, setPageInput] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showOnlyLibrary, setShowOnlyLibrary] = useState(false);
  const [notes, setNotes] = useState('');

  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    if (openPdfId) {
      const b = books.find(b => b.id === openPdfId);
      setNotes(b?.notes || '');
    }
  }, [openPdfId, books]);

  useEffect(() => {
    const fetchUserLibrary = async () => {
      if (!isLoggedIn) return;

      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8000/api/library/my-library", {
          headers: { authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          const userProgress = res.data.userProgress;
          const savedIds = userProgress.map(item => item.bookId);
          setSavedBookIds(savedIds);

          const updatedBooks = ALL_BOOKS.map(book => {
            const saved = userProgress.find(p => p.bookId === book.id);
            if (saved) {
              const total = saved.totalPages || book.totalPages;
              const progressPercent = total > 0
                ? Math.round((Number(saved.currentPage || 1) / Number(total)) * 100)
                : 0;
              return { ...book, ...saved, totalPages: total, progress: progressPercent };
            }
            return { ...book, progress: 0, currentPage: 1 };
          });

          setBooks(updatedBooks);
        }
      } catch (error) {
        console.error("Load Library Error:", error);
      }
    };

    fetchUserLibrary();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!navOpenBookId) return;
    const target = books.find(b => b.id === navOpenBookId);
    if (target) {
      setOpenPdfId(target.id);
      setPageInput(Math.max(1, Number(navJumpToPage || target.currentPage || 1)));
    }
  }, [books, navOpenBookId, navJumpToPage]);

  const handleSaveNotes = async (bookId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return toast.error('Please login');

    try {
      const res = await axios.post(
        'http://localhost:8000/api/library/update-notes',
        { bookId, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success('Notes saved');
        setBooks(prev => prev.map(b => (b.id === bookId ? { ...b, notes } : b)));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save notes');
    }
  };

  const handleAddToLibrary = async (book) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("⚠️ Please login again to save books!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/library/add-to-library",
        {
          bookId: book.id,
          title: book.title,
          totalPages: book.totalPages
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setSavedBookIds(prev => [...prev, book.id]);
      }
    } catch (error) {
      console.error("Save Error:", error.response);
      toast.error(error.response?.data?.message || "Failed to save book");
    }
  };

  const handleRemoveFromLibrary = async (book) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        "http://localhost:8000/api/library/remove-from-library",
        { bookId: book.id },
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("🗑️ Removed from Library");
        setSavedBookIds(prev => prev.filter(id => id !== book.id));
      }
    } catch (error) {
      toast.error("❌ Failed to remove book");
    }
  };

  const handleSaveProgress = async (book) => {
    if (!isLoggedIn) return toast.error("Please login to save your progress!");

    const newPage = Number(pageInput);
    if (Number.isNaN(newPage)) return toast.error("Enter a valid page number!");
    if (newPage > book.totalPages) return toast.error("Page cannot exceed total pages!");
    if (newPage < 1) return toast.error("Page number must be at least 1!");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        "http://localhost:8000/api/library/update-progress",
        {
          bookId: book.id,
          title: book.title,
          currentPage: newPage,
          totalPages: book.totalPages,
          isFinished: newPage === book.totalPages
        },
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("✅ Progress Saved!");
        setBooks(prevBooks => prevBooks.map(b => {
          if (b.id === book.id) {
            const newProgressPercent = Math.round((newPage / b.totalPages) * 100);
            return { ...b, currentPage: newPage, progress: newProgressPercent };
          }
          return b;
        }));
      }
    } catch (error) {
      console.error("Save Error Details:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to save progress");
    }
  };

  const filteredBooks = ALL_BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    const matchesLibrary = !showOnlyLibrary || savedBookIds.includes(book.id);
    return matchesSearch && matchesCategory && matchesLibrary;
  });

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-emerald-500";
    if (progress > 50) return "bg-sky-500";
    if (progress > 0) return "bg-amber-500";
    return "bg-slate-700";
  };

  const currentOpenBook = books.find(b => b.id === openPdfId);
  const pageForIframe = Math.max(1, Number(pageInput) || (currentOpenBook?.currentPage || 1));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-24 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER + BACK BUTTON */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              My <span className="text-orange-400">Library</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              {isLoggedIn
                ? `You have ${savedBookIds.length} saved books. Keep reading!`
                : "Login to save your reading progress and notes."}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-slate-900/80 p-4 rounded-xl shadow border border-slate-800 flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search books by title or author..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Tech">Tech & Coding</option>
            <option value="Science">Science</option>
            <option value="Classic">Classics</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Productivity">Productivity</option>
            <option value="History">History</option>
            <option value="Psychology">Psychology</option>
            <option value="Fiction">Fiction</option>
            <option value="Health">Health</option>
            <option value="Academic">Academic</option>
          </select>

          {isLoggedIn && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowOnlyLibrary(false)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  !showOnlyLibrary
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-900 border border-slate-700 text-slate-200"
                }`}
              >
                All Books
              </button>
              <button
                onClick={() => setShowOnlyLibrary(true)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  showOnlyLibrary
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-900 border border-slate-700 text-slate-200"
                }`}
              >
                My Library
              </button>
            </div>
          )}
        </div>

        {/* BOOK GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              const bookData = books.find(b => b.id === book.id) || book;
              return (
                <div
                  key={book.id}
                  className="bg-slate-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-800 relative group"
                >
                  <div className="absolute top-2 left-2 z-10">
                    {savedBookIds.includes(book.id) ? (
                      <button
                        onClick={() => handleRemoveFromLibrary(book)}
                        className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToLibrary(book)}
                        className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1 hover:bg-emerald-400 transition-colors"
                      >
                        <Plus size={12} /> Add
                      </button>
                    )}
                  </div>

                  {bookData.progress === 100 ? (
                    <div className="absolute top-2 right-2 z-10 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow">
                      <CheckCircle2 size={12} /> Finished
                    </div>
                  ) : bookData.progress > 0 && (
                    <div className="absolute top-2 right-2 z-10 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow">
                      <Clock size={12} /> {bookData.progress}%
                    </div>
                  )}

                  <div className="h-64 relative bg-slate-800">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => {
                          setOpenPdfId(book.id);
                          setPageInput(Math.max(1, Number(bookData.currentPage || 1)));
                        }}
                        className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <BookOpen size={18} /> Read Now
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg truncate text-slate-50">
                      {book.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">{book.author}</p>

                    {bookData.progress > 0 && (
                      <div className="border-t border-slate-800 pt-3">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Reading Progress</span>
                          <span>
                            {bookData.currentPage} / {bookData.totalPages || book.totalPages}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                              bookData.progress
                            )}`}
                            style={{ width: `${bookData.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-500 text-lg">
                No books found matching your filters
              </p>
            </div>
          )}
        </div>

        {/* MODAL */}
        {openPdfId && currentOpenBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-950 w-full max-w-6xl h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-slate-800">
              {/* Header */}
              <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg truncate text-slate-50">
                    {currentOpenBook.title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {currentOpenBook.author}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {isLoggedIn && (
                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
                      <span className="text-sm font-medium text-slate-100">
                        Page:
                      </span>
                      <input
                        type="number"
                        className="w-16 bg-slate-950 border border-slate-700 rounded p-1 text-center text-sm text-slate-50"
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                      />
                      <span className="text-sm text-slate-400">
                        / {currentOpenBook.totalPages}
                      </span>
                      <button
                        onClick={() => handleSaveProgress(currentOpenBook)}
                        className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-500 flex items-center gap-1 text-sm font-medium transition-colors"
                      >
                        <Save size={14} /> Save
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

              {/* Notes */}
              <div className="p-3 bg-slate-900 flex gap-2 items-start border-b border-slate-800">
                <textarea
                  className="flex-1 border border-slate-700 rounded-md p-2 text-sm bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                  rows={2}
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

              {/* PDF viewer */}
              <div className="flex-1 bg-slate-900 relative">
                <iframe
                  key={`${openPdfId}-${pageForIframe}`}
                  src={`${currentOpenBook.pdf}#page=${pageForIframe}&toolbar=0`}
                  className="w-full h-full absolute inset-0 border-0"
                  title={currentOpenBook.title}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LibraryPage;