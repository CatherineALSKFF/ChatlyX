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
- **Testing:** Jest (Unit Testing), Playwright (End-to-End Testing)

---

## 📂 Project Structure

```
chatly/
├── chat-backend/       # Backend WebSocket server
│   └── src/
│       └── server.ts
├── chat-frontend/      # React frontend
│   ├── src/
│   │   ├── components/  ├── __tests__/       # Jest tests
│   │   ├── styles/
│   │   └── App.tsx
│   └── tests/
│       
│       └── e2e/        # Playwright tests
└── README.md
```

---

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** 
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


### ✅ Completed Tests
- **Jest Unit Tests:** Fully cover core components like message input, sidebar, and room list.
- **Manual Testing:** All main features (messaging, editing, deleting, joining rooms) are verified.

### 🔍 Further Testing (Optional)
- Additional end-to-end tests (Playwright) were started but not fully implemented due to time constraints.  
- Manual tests confirm all core functionalities work as intended.

**Future Plan:**  
- Complete full E2E test coverage for joining rooms and messaging.  
- Optimize WebSocket handling in automated tests.

---

## 🕒 Time Spent

- **2 hours:** Backend development (WebSocket server, API setup)  
- **3.5 hours:** Frontend development (UI components, styling, real-time features)  
- **0.5 hours:** Debugging, manual testing, and code refinement  

**Total:** **6 hours**

---

## ⚡ Potential Improvements

If I had more time, I would:
- Resolve the WebSocket connection issue in the Playwright tests.   
- Implement additional features like emojis, image sharing, and dark mode.  
- Optimize performance for large datasets and real-time scalability.

---

## 💬 Final Notes

All core features of **ChatlyX** are fully functional and have been **manually tested**.  

Thank you for reviewing my work! I look forward to discussing this project further in the interview. 😊

---
