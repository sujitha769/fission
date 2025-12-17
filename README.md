# Eventify – Mini Event Platform (MERN Stack)

Eventify is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
The application allows users to create events, view upcoming events, and RSVP to events while enforcing capacity limits and preventing overbooking.

This project was developed as part of a MERN Stack Intern technical screening assignment.



## Features Implemented

### Authentication
- User signup and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected backend APIs
- Protected frontend routes

### Event Management
- Create events with title, description, date & time, location, capacity, category, and image upload
- View all upcoming events
- Update event details (only by the event creator)
- Delete events (only by the event creator)

### RSVP System
- Users can join and leave events
- Event capacity is strictly enforced
- Duplicate RSVPs are not allowed
- Overbooking is prevented even when multiple users try to RSVP at the same time

### User Profile
- Profile page for logged-in users
- Displays the user name
- Lists events created by the user
- Update and delete options available only on the profile page

### Event Status Display
- Each event card shows its current status:
  - Starts in X hours/minutes
  - Live now
  - Ended
- Status is calculated dynamically based on the current time

### Frontend
- Built using React
- Axios used for API communication
- JWT automatically attached to API requests
- Navigation bar with logout functionality
- Responsive layout using plain CSS
-Integrated CRUD operations

## Technology Stack

.. Frontend
- React
- React Router DOM
- Axios
- CSS

..Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- JSON Web Tokens (JWT)
- bcrypt

---

## Running the Application Locally

### Backend Setup





### deployment
backend-render
frontend-netlify
database-mongodb atlas



bash
cd backend
npm install
npm start
