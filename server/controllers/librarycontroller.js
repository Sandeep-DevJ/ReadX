// server/controllers/librarycontroller.js
import { Library } from '../models/Library.js';

// GET reading statistics for current user
export const getStats = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const items = await Library.find({ userId });

    const totalBooks = items.length;
    const finishedBooks = items.filter(b => b.isFinished).length;
    const inProgressBooks = items.filter(b => b.currentPage > 0 && !b.isFinished).length;
    const totalPagesRead = items.reduce((sum, b) => sum + (b.currentPage || 0), 0);

    // pick latest 3 recently read for "Continue Reading"
    const continueReading = items
      .filter(b => b.currentPage > 0 && !b.isFinished)
      .sort((a, b) => new Date(b.lastRead) - new Date(a.lastRead))
      .slice(0, 3);

    return res.status(200).json({
      success: true,
      stats: {
        totalBooks,
        finishedBooks,
        inProgressBooks,
        totalPagesRead,
        continueReading
      }
    });
  } catch (error) {
    console.error('getStats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error in getStats',
      error: error.message,
    });
  }
};

// OPTIONAL: update notes for a book
export const updateNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId, notes } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });
    if (bookId == null) {
      return res.status(400).json({ success: false, message: 'bookId is required' });
    }

    const updated = await Library.findOneAndUpdate(
      { userId, bookId: Number(bookId) },
      { notes: notes || '' },
      { new: true }
    );

    return res.status(200).json({ success: true, message: 'Notes updated', item: updated });
  } catch (error) {
    console.error('updateNotes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error in updateNotes',
      error: error.message,
    });
  }
};

// ✅ BACKEND ADD TO LIBRARY (This stays on server)
export const addToLibrary = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { bookId, title, totalPages } = req.body;

    if (!bookId || !totalPages) {
      return res.status(400).json({
        success: false,
        message: 'bookId and totalPages are required',
      });
    }

    // Check if book is already saved to avoid duplicates
    let existingBook = await Library.findOne({ userId, bookId: Number(bookId) });
    if (existingBook) {
      return res.status(200).json({
        success: true,
        message: 'Book already in your library',
        libraryItem: existingBook,
      });
    }

    // Create new saved book record
    const newSavedBook = await Library.create({
      userId,
      bookId: Number(bookId),
      title,
      totalPages,
      currentPage: 0,
      isFinished: false,
    });

    return res.status(201).json({
      success: true,
      message: '✅ Book added to your library',
      libraryItem: newSavedBook,
    });
  } catch (error) {
    console.error('addToLibrary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error adding book',
      error: error.message,
    });
  }
};

// ✅ REMOVE book from user library
export const removeFromLibrary = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if(!bookId) {
      return res.status(400).json({ success: false, message: 'bookId is required' });
    }

    await Library.findOneAndDelete({ userId, bookId: Number(bookId) });

    return res.status(200).json({
      success: true,
      message: '🗑️ Book removed from your library',
    });
  } catch (error) {
    console.error('removeFromLibrary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error removing book',
      error: error.message,
    });
  }
};

// ✅ UPDATE reading progress
export const updateProgress = async (req, res) => {
  try {
    // 1. Get logged in user ID from your auth middleware
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Please log in first" });

    // 2. Get data sent from frontend
    const { bookId, currentPage, totalPages, isFinished, title } = req.body;

    // 3. Validate no missing data
    if (!bookId || currentPage == null || !totalPages) {
      return res.status(400).json({ success: false, message: "Missing required page data" });
    }

    // 4. Save to database (create new record if it doesn't exist)
    const updatedProgress = await Library.findOneAndUpdate(
      { userId, bookId: Number(bookId) }, // Match the logged in user + selected book
      {
        userId,
        bookId: Number(bookId),
        title,
        currentPage: Number(currentPage), // ✅ FORCE TO NUMBER TO AVOID STRING BUGS
        totalPages: Number(totalPages),
        isFinished: !!isFinished,
        lastRead: new Date() // Update last read time for "Continue Reading"
      },
      { new: true, upsert: true } // Create record if it doesn't exist yet
    );

    // 5. Send success response back to frontend
    return res.status(200).json({
      success: true,
      message: "✅ Progress Saved!",
      progress: updatedProgress
    });

  } catch (error) {
    console.error("Save Progress Error:", error);
    return res.status(500).json({ success: false, message: "Server error saving progress" });
  }
};

// ✅ GET all saved books for user
export const getLibrary = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('getLibrary userId:', userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const userProgress = await Library.find({ userId });

    return res.status(200).json({
      success: true,
      userProgress,
    });
  } catch (error) {
    console.error('getLibrary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error loading library',
      error: error.message,
    });
  }
};