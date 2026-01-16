import mongoose from 'mongoose';

const librarySchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
bookId: { type: Number, required: true }, // static frontend id
title: { type: String },
currentPage: { type: Number, default: 0 },
totalPages: { type: Number, required: true },
isFinished: { type: Boolean, default: false },
lastRead: { type: Date, default: Date.now },
notes: { type: String, default: '' }
}, { timestamps: true });

// One record per (user, book)
librarySchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const Library = mongoose.models.Library || mongoose.model('Library', librarySchema);