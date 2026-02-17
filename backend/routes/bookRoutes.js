const express = require("express");
const supabase = require("../config/supabase");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL BOOKS
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*, users(name,email,phone,location)");

    if (error) return res.status(500).json({ message: error.message });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE BOOK
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*, users(name,email,phone,location)")
      .eq("id", req.params.id)
      .single();

    if (error) return res.status(404).json({ message: "Book not found" });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST BOOK
router.post("/", protect, async (req, res) => {
  try {
    const { title, author, category, condition, price, location, image, description } =
      req.body;

    if (!title || !author || !category || !condition || !price || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data, error } = await supabase.from("books").insert([
      {
        title,
        author,
        category,
        condition,
        price,
        location,
        image,
        description,
        seller_id: req.user.userId,
      },
    ]);

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json({ message: "Book added successfully", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE BOOK
router.delete("/:id", protect, async (req, res) => {
  try {
    // first check book exists
    const { data: book, error: findErr } = await supabase
      .from("books")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (!book || findErr) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.seller_id !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed to delete this book" });
    }

    const { error } = await supabase.from("books").delete().eq("id", req.params.id);

    if (error) return res.status(500).json({ message: error.message });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;