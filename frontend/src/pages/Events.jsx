import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import "../styles/events.css";

function Events() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  const categories = [
    "All",
    "Technology",
    "Business",
    "Arts",
    "Sports",
    "Music",
    "Education",
    "Health",
    "Food",
    "Other"
  ];

  // 🔐 PROTECT PAGE: redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
      setFilteredEvents(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        // token invalid or expired
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Failed to load events:", err);
        alert("Failed to load events");
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(event =>
        event.category === selectedCategory
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.dateTime).toDateString();
        const filterDate = new Date(selectedDate).toDateString();
        return eventDate === filterDate;
      });
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, selectedDate, events]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedDate("");
  };

  return (
    <>
      <Navbar />

      <div className="events-container">
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "30px",
            color: "#5d1495ff"
          }}
        >
          All Events
        </h2>

        <div
          className="filters-container"
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginBottom: "15px"
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                🔍 Search Event
              </label>
              <input
                type="text"
                placeholder="Search by event name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                📂 Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                📅 Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px"
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              Showing {filteredEvents.length} of {events.length} events
              {searchTerm && ` • Searching: "${searchTerm}"`}
              {selectedCategory !== "All" && ` • Category: ${selectedCategory}`}
              {selectedDate && ` • Date: ${new Date(selectedDate).toLocaleDateString()}`}
            </p>

            {(searchTerm || selectedCategory !== "All" || selectedDate) && (
              <button
                onClick={clearFilters}
                style={{
                  padding: "8px 16px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "18px", color: "#6b7280" }}>
              {events.length === 0
                ? "No events available yet."
                : "No events match your filters. Try adjusting your search."}
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              refreshEvents={fetchEvents}
            />
          ))
        )}
      </div>
    </>
  );
}

export default Events;
