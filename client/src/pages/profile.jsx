import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Trash2, LogOut, User as UserIcon, BarChart3, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/context/userContext'; // Assuming you have this from WelcomePage

// ================= ASSET IMPORTS (Required to show covers) =================
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

import coverS1 from '../assets/s1.png';   import pdfS1 from '../assets/1st.pdf'; 
import coverS2 from '../assets/s2.png';   import pdfS2 from '../assets/s2.pdf';
import coverS3 from '../assets/s3.png';   import pdfS3 from '../assets/s3.pdf';
import coverS4 from '../assets/s4.png';   import pdfS4 from '../assets/s4.pdf';
import coverS5 from '../assets/s5.png';   import pdfS5 from '../assets/s5.pdf';
import coverS6 from '../assets/s6.png';   import pdfS6 from '../assets/s6.pdf';
import coverS7 from '../assets/s7.png';   import pdfS7 from '../assets/s7.pdf';
import coverS8 from '../assets/s8.png';   import pdfS8 from '../assets/s8.pdf';
import coverS9 from '../assets/s9.png';   import pdfS9 from '../assets/s9.pdf';
import coverS10 from '../assets/s10.png'; import pdfS10 from '../assets/s10.pdf';

import coverSC1 from '../assets/sc1.jpg'; import pdfSC1 from '../assets/sc1.pdf';
import coverSC2 from '../assets/sc2.png'; import pdfSC2 from '../assets/sc2.pdf';
import coverSC3 from '../assets/sc3.png'; import pdfSC3 from '../assets/sc3.pdf';
import coverSC4 from '../assets/sc4.png'; import pdfSC4 from '../assets/sc4.pdf';
import coverSC5 from '../assets/sc5.png'; import pdfSC5 from '../assets/sc5.pdf';
import coverSC6 from '../assets/sc6.png'; import pdfSC6 from '../assets/sc6.pdf';
import coverSC7 from '../assets/sc7.png'; import pdfSC7 from '../assets/sc7.pdf';
import coverSC8 from '../assets/sc8.png'; import pdfSC8 from '../assets/sc8.pdf';

const ALL_BOOKS = [
  { id: 1, title: "C++ Programming", author: "Tech Series", cover: cover1, pdf: pdf1, totalPages: 200 },
  { id: 2, title: "Advanced C++", author: "Tech Series", cover: cover2, pdf: pdf2, totalPages: 300 },
  { id: 3, title: "Data Structures", author: "Tech Series", cover: cover3, pdf: pdf3, totalPages: 250 },
  { id: 4, title: "Algorithms", author: "Tech Series", cover: cover4, pdf: pdf4, totalPages: 328 },
  { id: 5, title: "Web Development", author: "Tech Series", cover: cover5, pdf: pdf5, totalPages: 220 },
  { id: 6, title: "Java Basics", author: "Tech Series", cover: cover6, pdf: pdf6, totalPages: 350 },
  { id: 7, title: "Python Guide", author: "Tech Series", cover: cover7, pdf: pdf7, totalPages: 460 },
  { id: 8, title: "React JS", author: "Tech Series", cover: cover8, pdf: pdf8, totalPages: 499 },
  { id: 9, title: "Node JS", author: "Tech Series", cover: cover9, pdf: pdf9, totalPages: 440 },
  { id: 10, title: "Database Design", author: "Tech Series", cover: cover10, pdf: pdf10, totalPages: 180 },
  { id: 11, title: "Comic Vol 1", author: "Comic World", cover: coverC1, pdf: pdfC1, totalPages: 100 },
  { id: 12, title: "Comic Vol 2", author: "Comic World", cover: coverC2, pdf: pdfC2, totalPages: 100 },
  { id: 13, title: "Comic Vol 3", author: "Comic World", cover: coverC3, pdf: pdfC3, totalPages: 100 },
  { id: 14, title: "Comic Vol 4", author: "Comic World", cover: coverC4, pdf: pdfC4, totalPages: 100 },
  { id: 15, title: "Comic Vol 5", author: "Comic World", cover: coverC5, pdf: pdfC5, totalPages: 100 },
  { id: 16, title: "Comic Vol 6", author: "Comic World", cover: coverC6, pdf: pdfC6, totalPages: 100 },
  { id: 17, title: "Comic Vol 7", author: "Comic World", cover: coverC7, pdf: pdfC7, totalPages: 100 },
  { id: 18, title: "Comic Vol 8", author: "Comic World", cover: coverC8, pdf: pdfC8, totalPages: 100 },
  { id: 19, title: "Comic Vol 9", author: "Comic World", cover: coverC9, pdf: pdfC9, totalPages: 100 },
  { id: 20, title: "Comic Vol 10", author: "Comic World", cover: coverC10, pdf: pdfC10, totalPages: 100 },
  { id: 21, title: "Mindset", author: "Life Coach", cover: coverS1, pdf: pdfS1, totalPages: 380 },
  { id: 22, title: "Growth", author: "Life Coach", cover: coverS2, pdf: pdfS2, totalPages: 256 },
  { id: 23, title: "Focus", author: "Life Coach", cover: coverS3, pdf: pdfS3, totalPages: 360 },
  { id: 24, title: "Discipline", author: "Life Coach", cover: coverS4, pdf: pdfS4, totalPages: 220 },
  { id: 25, title: "Power", author: "Life Coach", cover: coverS5, pdf: pdfS5, totalPages: 400 },
  { id: 26, title: "Energy", author: "Life Coach", cover: coverS6, pdf: pdfS6, totalPages: 600 },
  { id: 27, title: "Habits", author: "Life Coach", cover: coverS7, pdf: pdfS7, totalPages: 480 },
  { id: 28, title: "Sleep", author: "Life Coach", cover: coverS8, pdf: pdfS8, totalPages: 360 },
  { id: 29, title: "Breath", author: "Life Coach", cover: coverS9, pdf: pdfS9, totalPages: 300 },
  { id: 30, title: "Body", author: "Life Coach", cover: coverS10, pdf: pdfS10, totalPages: 450 },
  { id: 31, title: "Physics 101", author: "Science Hub", cover: coverSC1, pdf: pdfSC1, totalPages: 320 },
  { id: 32, title: "Chemistry", author: "Science Hub", cover: coverSC2, pdf: pdfSC2, totalPages: 210 },
  { id: 33, title: "Biology", author: "Science Hub", cover: coverSC3, pdf: pdfSC3, totalPages: 400 },
  { id: 34, title: "Astronomy", author: "Science Hub", cover: coverSC4, pdf: pdfSC4, totalPages: 200 },
  { id: 35, title: "Geology", author: "Science Hub", cover: coverSC5, pdf: pdfSC5, totalPages: 600 },
  { id: 36, title: "Ecology", author: "Science Hub", cover: coverSC6, pdf: pdfSC6, totalPages: 240 },
  { id: 37, title: "Zoology", author: "Science Hub", cover: coverSC7, pdf: pdfSC7, totalPages: 300 },
  { id: 38, title: "Botany", author: "Science Hub", cover: coverSC8, pdf: pdfSC8, totalPages: 280 },
];

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const [myBooks, setMyBooks] = useState([]);
  const [stats, setStats] = useState({ totalBooks: 0, finishedBooks: 0, pagesRead: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGOUT HANDLER ---
  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:8000/user/logout", {}, {
        headers: { authorization: `Bearer ${accessToken}` }
      });
      if (res.data.success) {
        setUser(null);
        toast.success("Logged out successfully");
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        // 1. Get Library & Progress
        const resLibrary = await axios.get("http://localhost:8000/api/library/my-library", {
          headers: { authorization: `Bearer ${accessToken}` }
        });

        // 2. Get Stats
        const resStats = await axios.get("http://localhost:8000/api/library/stats", {
          headers: { authorization: `Bearer ${accessToken}` }
        });

        if (resLibrary.data.success) {
          const userProgress = resLibrary.data.userProgress;
          
          // Merge backend data with static book details
          const mergedBooks = userProgress.map(savedItem => {
            const bookDetails = ALL_BOOKS.find(b => b.id === savedItem.bookId);
            if (!bookDetails) return null;
            
            const total = savedItem.totalPages || bookDetails.totalPages;
            const progress = total > 0 ? Math.round((savedItem.currentPage / total) * 100) : 0;
            
            return {
              ...bookDetails,
              ...savedItem,
              progress,
              totalPages: total
            };
          }).filter(Boolean); // Remove nulls

          setMyBooks(mergedBooks.reverse()); // Show newest added first
        }

        if (resStats.data.success) {
          setStats(resStats.data.stats);
        }

      } catch (error) {
        console.error("Profile Fetch Error:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken, navigate]);

  // --- REMOVE BOOK ---
  const handleRemoveBook = async (bookId) => {
    if (!confirm("Are you sure you want to remove this book from your library?")) return;

    try {
      const res = await axios.post("http://localhost:8000/api/library/remove-from-library", 
        { bookId }, 
        { headers: { authorization: `Bearer ${accessToken}` } }
      );

      if (res.data.success) {
        toast.success("Removed from library");
        setMyBooks(prev => prev.filter(b => b.bookId !== bookId));
        // Update stats locally
        setStats(prev => ({ ...prev, totalBooks: prev.totalBooks - 1 }));
      }
    } catch (error) {
      toast.error("Failed to remove book");
    }
  };

  // --- CONTINUE READING ---
  const handleContinue = (book) => {
    navigate('/library', { 
        state: { 
            openBookId: book.bookId,
            jumpToPage: book.currentPage 
        } 
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading your profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <span className="text-4xl font-bold text-gray-800">
                            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </span>
                    </div>
                </div>

                {/* User Info */}
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{user?.username || "Reader"}</h1>
                    <p className="text-gray-500">{user?.email}</p>
                    <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                        <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                            Home
                        </button>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium flex items-center gap-2">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
                    <div className="bg-blue-50 p-4 rounded-xl text-center min-w-[100px]">
                        <BookOpen className="mx-auto text-blue-600 mb-1" size={24} />
                        <div className="text-xl font-bold text-gray-800">{stats.totalBooks}</div>
                        <div className="text-xs text-gray-500">Books</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl text-center min-w-[100px]">
                        <CheckCircle2 className="mx-auto text-green-600 mb-1" size={24} />
                        <div className="text-xl font-bold text-gray-800">{stats.finishedBooks}</div>
                        <div className="text-xs text-gray-500">Finished</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl text-center min-w-[100px]">
                        <BarChart3 className="mx-auto text-purple-600 mb-1" size={24} />
                        <div className="text-xl font-bold text-gray-800">{stats.totalPagesRead || 0}</div>
                        <div className="text-xs text-gray-500">Pages</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- MY LIBRARY GRID --- */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 rounded-full bg-blue-600"></div>
            <h2 className="text-2xl font-bold text-gray-900">My Library</h2>
        </div>

        {myBooks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900">Your library is empty</h3>
                <p className="text-gray-500 mt-1 mb-6">Start adding books to track your progress.</p>
                <button onClick={() => navigate('/category')} className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                    Browse Categories
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myBooks.map((book) => (
                    <div key={book.bookId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group relative">
                        {/* Remove Button */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleRemoveBook(book.bookId); }}
                            className="absolute top-2 right-2 z-10 bg-white/90 p-2 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                            title="Remove from Library"
                        >
                            <Trash2 size={16} />
                        </button>

                        {/* Cover */}
                        <div className="h-48 bg-gray-100 relative overflow-hidden cursor-pointer" onClick={() => handleContinue(book)}>
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            
                            {/* Progress Badge */}
                            {book.progress === 100 ? (
                                <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Finished
                                </div>
                            ) : book.progress > 0 ? (
                                <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow flex items-center gap-1">
                                    <Clock size={12} /> {book.progress}%
                                </div>
                            ) : null}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 truncate mb-1">{book.title}</h3>
                            <p className="text-xs text-gray-500 mb-4">{book.author}</p>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                    <span>{book.currentPage} / {book.totalPages} pages</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div 
                                        className={`h-1.5 rounded-full transition-all duration-500 ${book.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                        style={{ width: `${book.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={() => handleContinue(book)}
                                className="w-full py-2 rounded-lg bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors"
                            >
                                {book.progress > 0 ? "Continue Reading" : "Start Reading"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;