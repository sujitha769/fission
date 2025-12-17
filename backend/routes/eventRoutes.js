import express from "express";
import Event from "../models/Event.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();


router.get("/my-events", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.userId });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user events" });
  }
});


router.post("/", authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      dateTime,
      location,
      capacity,
      category
    } = req.body;

    if (!title || !description || !dateTime || !location || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = '';
    if (req.file) {
     
      imageUrl = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    const event = await Event.create({
      title,
      description,
      dateTime,
      location,
      capacity: parseInt(capacity),
      category: category || 'Other',
      imageUrl,
      createdBy: req.userId,
      attendees: []
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: "Event creation failed", error: error.message });
  }
});


router.get("/", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({
      dateTime: { $gte: new Date() }
    })
      .sort({ dateTime: 1 })
      .populate("createdBy", "name email");

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});


router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});


router.put("/:id", authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Ownership check
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to edit this event" });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      dateTime: req.body.dateTime,
      location: req.body.location,
      capacity: parseInt(req.body.capacity),
      category: req.body.category || event.category || 'Other'
    };


    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Event update failed" });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

 
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Event deletion failed" });
  }
});



router.post("/:id/rsvp", authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        attendees: { $ne: userId },
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }
      },
      {
        $addToSet: { attendees: userId }
      },
      { new: true }
    );

    if (!event) {
      return res.status(400).json({
        message: "Event is full or you already joined"
      });
    }

    res.status(200).json({
      message: "Successfully joined the event",
      attendeesCount: event.attendees.length
    });
  } catch (error) {
    res.status(500).json({ message: "RSVP failed" });
  }
});

router.post("/:id/leave", authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: userId } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "You have left the event",
      attendeesCount: event.attendees.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to leave event" });
  }
});

export default router;