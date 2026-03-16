const noteService = require("../services/noteService");

/**
 * Create Note
 */
exports.createNote = async (req, res) => {
  try {
    const note = await noteService.createNote(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: note,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Notes By Related Entity
 */
exports.getNotesByRelated = async (req, res) => {
  try {
    const notes = await noteService.getNotesByRelated(
      req.params.relatedId
    );

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Note
 */
exports.deleteNote = async (req, res) => {
  try {
    const existing = await noteService.getNoteById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    await noteService.deleteNote(req.params.id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};