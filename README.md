# KUConnect

KUConnect is a platform designed to connect university students, facilitating collaboration, networking, and academic discussions. Built using the MERN (MongoDB, Express, React, Node.js) stack, KUConnect provides a seamless experience for students to engage with peers, join study groups, share resources, and stay updated on university events.

## aFeatures

- **User Authentication**: Secure login and signup with JWT authentication.
- **Student Networking**: Connect with fellow students, send messages, and create profiles.
- **Event Management**: Stay informed about university events and activities.
- **Instant Messaging**: Have access to instant messaging to fellow students and faculties. 
- **Video Calling**: Instant p2p call with your users in the platform. 
## Tech Stack

KUConnect is developed using the **MERN** stack:

- **MongoDB** - NoSQL database for storing user profiles, posts, and messages.
- **Express.js** - Backend framework for handling API requests.
- **React.js** - Frontend library for building an interactive UI.
- **Node.js** - Server-side runtime environment.

## Installation

Follow these steps to set up KUConnect on your local machine:

### Prerequisites

Ensure you have the following installed:

- Node.js (Latest LTS version recommended)
- MongoDB (Running locally or using a cloud service like MongoDB Atlas)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/adinteressant/KUConnect.git
   cd KUConnect
   ```
2. **Install dependencies**
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd frontend
     npm install
     ```
3. **Set up environment variables**
   - Create a `.env` file in the `backend` directory with the necessary configurations
4. **Start the application**
   - Run the backend:
     ```bash
     cd backend
     npm start
     ```
   - Run the frontend:
     ```bash
     cd frontend
     npm run dev
     ```

## Contributing

We welcome contributions to improve KUConnect! To contribute:

1. Fork the repository and create a new branch.
2. Implement your changes and commit with a descriptive message.
3. Push to your fork and create a pull request.
4. Wait for the maintainers to review and merge your changes.

