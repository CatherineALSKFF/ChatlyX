# ChatlyX

ChatlyX is a lightweight real-time chat application designed as part of a frontend developer homework exercise. It features real-time messaging, user tracking, and responsive design, with a clean and functional interface adhering to the provided mockups.

---

## 🚀 Features

- **Real-time Messaging:** Messages are instantly synchronized across multiple devices.
- **Message Editing:** Users can edit their own messages, with visible indicators for edits.
- **Message Deletion:** Users can delete their messages, and participants see the updates in real time.
- **Active Participants:** Displays the list of users currently in the chat session.
- **Multiple Chat Rooms:** Create and join chat rooms for focused conversations.
- **Responsive Design:** Optimized for both desktop and mobile layouts.

---

## 🛠️ Technologies Used

- **Frontend:** React, TypeScript, CSS Modules
- **Backend:** Node.js with WebSocket API
- **Real-time Communication:** Native WebSocket

---

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v16 or higher)
- **npm** (or **yarn**)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CatherineALSKFF/live-chat-app--v1.git
   cd chatly
   ```

2. Install dependencies for both the backend and frontend:
   ```bash
   cd chat-backend
   npm install
   cd ../chat-frontend
   npm install
   ```

---

### Running the Application

1. Start the backend server:
   ```bash
   cd chat-backend
   npx ts-node src/server.ts
   ```

2. Start the frontend client:
   ```bash
   cd chat-frontend
   npm start
   ```

3. Open the application in your browser:
   [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing Instructions

### Test Real-time Messaging
- Open the app on multiple devices or browser tabs.
- Send messages and observe their synchronization across all clients.

### Test Message Editing & Deletion
- Edit or delete your own messages and verify updates across participants.

### Test Active Participants
- Check the list of participants as users join or leave the chat.

---

## 🕒 Time Spent

- **1-2 hours:** Backend implementation (WebSocket server and API design).
- **... hours:** Frontend implementation (UI components, styling, and integration).
- **... hours:** Debugging, testing, and refinement.

Total: **... hours**

---