import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    capacity: "",
    imageUrl: "",
    category: "Other"
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  return () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };
}, [imagePreview]);


  const categories = [
    'Technology',
    'Business', 
    'Arts',
    'Sports',
    'Music',
    'Education',
    'Health',
    'Food',
    'Other'
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/events/${id}`);
        const event = res.data;

        setForm({
          title: event.title,
          description: event.description,
          dateTime: event.dateTime.slice(0, 16),
          location: event.location,
          capacity: event.capacity,
          imageUrl: event.imageUrl,
          category: event.category || "Other"
        });
     
     setImagePreview(
  event.imageUrl && event.imageUrl.startsWith("http")
    ? event.imageUrl
    : ""
);

        setError(null);
      } catch (err) {
        console.error("Failed to load event:", err);
        setError("Event not found or failed to load");
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
 
      if (imageFile) {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("dateTime", form.dateTime);
        formData.append("location", form.location);
        formData.append("capacity", form.capacity);
        formData.append("category", form.category);
        formData.append("image", imageFile);

        await API.put(`/events/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // No new image, just update text fields
        await API.put(`/events/${id}`, form);
      }

      alert("Event updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center" }}>
          <h2>Loading event...</h2>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center" }}>
          <h2 style={{ color: "red" }}>{error}</h2>
          <p>Redirecting to profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
        <h2>Edit Event</h2>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Title:
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event Title"
            required
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Description:
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows="4"
            required
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Category:
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Date & Time:
          </label>
          <input
            type="datetime-local"
            name="dateTime"
            value={form.dateTime}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Location:
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            required
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Capacity:
          </label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            required
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Event Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          
          {imagePreview && (
            <div style={{ marginBottom: "15px" }}>
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "5px" }}>
                Current/Preview Image:
              </p>
              <img 
                src={imagePreview} 
                alt="Event preview" 
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "200px", 
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Update Event
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/profile")}
              style={{
                flex: 1,
                padding: "12px",
                background: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditEvent;