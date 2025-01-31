<<<<<<< HEAD
require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors"); // ✅ Import CORS at the top
const mongoose = require("mongoose");

const app = express(); // ✅ Initialize app FIRST

app.use(cors()); // ✅ Use CORS after initializing `app`
app.use(express.json()); // ✅ Middleware for parsing JSON

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// Define Task model
const Task = mongoose.model("Task", {
  dueDate: String,
  completeDate: String,
  description: String,
  category: String,
  timeCommitment: Number,
});

// ✅ Route to handle form submission
app.post("/save-task", async (req, res) => {
  try {
    console.log("📩 Form Data Received:", req.body); // Debugging

    const newTask = new Task(req.body);
    await newTask.save(); // ✅ Save to MongoDB

    console.log("✅ Task Saved to MongoDB:", newTask); // Debugging
    res.status(201).json({ message: "✅ Task saved successfully!" });
  } catch (error) {
    console.error("❌ Save Error:", error);
    res.status(500).json({ error: "❌ Failed to save task" });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

app.get("/all-tasks", async (req, res) => {
  try {
    const tasks = await Task.find({}); // Fetch all tasks
    console.log("📤 Sending tasks:", tasks); // Debugging: Check if tasks are returned
    res.json(tasks);
  } catch (error) {
    console.error("❌ Error retrieving tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/update-task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completeDate } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completeDate: completeDate },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

=======
const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, Node.js Server!");
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
});
>>>>>>> a4e800ab (Push frontend code)
