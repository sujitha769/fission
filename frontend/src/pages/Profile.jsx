import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/events.css";

function Profile() {
  const [events, setEvents] = useState([]);
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchMyEvents = async () => {
    try {
      const res = await API.get("/events/my-events");
      console.log("Fetched events:", res.data);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      alert("Failed to load your events");
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [location]);

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await API.delete(`/events/${id}`);
      alert("Event deleted successfully!");
      fetchMyEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  const handleEdit = (eventId) => {
    console.log("Navigating to edit event:", eventId);
    navigate(`/edit/${eventId}`);
  };

  return (
    <>
      <Navbar />

      <div className="events-container">
   
        

        {events.length === 0 ? (
          <p>You haven't created any events yet.</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <h3 style={{ color: "#491997ff", fontWeight: 600, fontSize: "1.5rem" }}>
                {event.title}
              </h3>

          
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
                <b>📅 Date:</b> {new Date(event.dateTime).toLocaleString()}
              </p>
              
              <p>
                <b>📍 Location:</b> {event.location}
              </p>
              
              <p>
                <b>👥 Seats:</b> {event.attendees.length} / {event.capacity}
              </p>

              <div className="event-actions">
                <button onClick={() => handleEdit(event._id)}>
                  Update
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteEvent(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Profile;