import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";   

function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    capacity: "",
    category: "Other",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Technology",
    "Business",
    "Arts",
    "Sports",
    "Music",
    "Education",
    "Health",
    "Food",
    "Other",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!imageFile) {
      setError("Please select an image");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("dateTime", form.dateTime);
      formData.append("location", form.location);
      formData.append("capacity", form.capacity);
      formData.append("category", form.category);
      formData.append("image", imageFile);

      await fetch("https://fission-ij93.onrender.com/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      alert("Event created successfully!");
      navigate("/events");
    } catch (err) {
      setError("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
        <h2 style={{ marginBottom: "30px", fontSize: "28px", fontWeight: "bold" }}>
          Create Event
        </h2>

        {error && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "6px",
              border: "1px solid #fcc",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
    
          <input
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <br /><br />

   
          <textarea
            name="description"
            placeholder="Event Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <br /><br />

          
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <br /><br />

         
       <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
  EventDate & Time
</label>

<input
  type="datetime-local"
  name="dateTime"
  value={form.dateTime}
  onChange={handleChange}
  required
  style={{ width: "100%" }}
/>


          <br /><br />

      
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <br /><br />

          
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            required
          />

          <br /><br />

        
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "100%", marginTop: "15px" }}
            />
          )}

          <br /><br />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateEvent;
