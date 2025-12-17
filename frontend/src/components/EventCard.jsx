import { useState, useEffect } from "react";
import API from "../api/api";
import "../styles/events.css";

function EventCard({ event, refreshEvents }) {
  const userId = localStorage.getItem("userId");
  const isJoined = event.attendees.includes(userId);
  const isOwner = event.createdBy?._id === userId;
  
  const [countdown, setCountdown] = useState("");
  const [statusColor, setStatusColor] = useState("#2563eb");

  // Calculate event status with live countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const start = new Date(event.dateTime);
      const diffMs = start - now;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      // Event ended (assuming 2 hour duration)
      if (diffMinutes <= -120) {
        setCountdown("Ended");
        setStatusColor("#6b7280");
        return;
      }
      
      // Event is live now
      if (diffMinutes <= 0) {
        setCountdown("Live now");
        setStatusColor("#16a34a");
        return;
      }
      
      // More than 24 hours away - show in days
      if (diffMinutes > 1440) {
        const days = Math.floor(diffMinutes / 1440);
        const remainingHours = Math.floor((diffMinutes % 1440) / 60);
        
        if (days === 1) {
          setCountdown(`Starts in 1 day ${remainingHours}h`);
        } else {
          setCountdown(`Starts in ${days} days`);
        }
        setStatusColor("#2563eb");
        return;
      }
      
      // Within 24 hours - show live countdown like a clock
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      setCountdown(`Starts in ${formattedTime}`);
      setStatusColor("#ea580c");
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [event.dateTime]);

  const joinEvent = async () => {
    try {
      await API.post(`/events/${event._id}/rsvp`);
      refreshEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join event");
    }
  };

  const leaveEvent = async () => {
    try {
      await API.post(`/events/${event._id}/leave`);
      refreshEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave event");
    }
  };

  const deleteEvent = async () => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await API.delete(`/events/${event._id}`);
      refreshEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div className="event-card">
      {/* Title and countdown in same row */}
      <div className="event-header">
        <h3 style={{ color: "#491997ff", fontWeight: 600, fontSize: "1.5rem" }}>
          {event.title}
        </h3>
        <div className="event-status" style={{ color: statusColor }}>
          {countdown}
        </div>
      </div>
      
      {/* Category Badge */}
      <div style={{ 
        display: "inline-block", 
        padding: "4px 12px", 
        background: "#e0e7ff", 
        color: "#4338ca",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "600",
        marginBottom: "10px"
      }}>
        {event.category || 'Other'}
      </div>

      {/* Event Image */}
      {event.imageUrl && (
        <div className="event-image">
          <img 
            src={`http://localhost:5000${event.imageUrl}`} 
            alt={event.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
            }}
          />
        </div>
      )}
      
      <p>{event.description}</p>
      <p>
        <b>📍 Location:</b> {event.location}
      </p>
      <p>
        <b>👥 Seats:</b> {event.attendees.length} / {event.capacity}
      </p>
      
      <div className="event-actions">
        {!isJoined ? (
          <button onClick={joinEvent}>Join</button>
        ) : (
          <button onClick={leaveEvent}>Leave</button>
        )}
        {isOwner && (
          <button className="delete-btn" onClick={deleteEvent}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;