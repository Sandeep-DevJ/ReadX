import express from 'express';
import { addToLibrary, removeFromLibrary, updateProgress, getLibrary, getStats, updateNotes } from '../controllers/librarycontroller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';


const router = express.Router();

router.post('/add-to-library', isAuthenticated, addToLibrary);
router.post('/remove-from-library', isAuthenticated, removeFromLibrary);
router.post('/update-progress', isAuthenticated, updateProgress);
router.get('/my-library', isAuthenticated, getLibrary);
router.get('/stats', isAuthenticated, getStats);          // <-- NEW
router.post('/update-notes', isAuthenticated, updateNotes)

export default router;  