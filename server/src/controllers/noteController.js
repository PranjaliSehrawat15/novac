const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      createdBy: req.user.id,
    });

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