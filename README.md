# ChatlyX

ChatlyX is a lightweight, real-time chat application built as part of a frontend developer homework exercise. It includes real-time messaging, user tracking, and a clean, responsive design aligned with the provided mockups. Additionally, I introduced **chat rooms** and **emoji support** to enhance the user experience.

---

## 🚀 Features

- **Real-time Messaging:** Instantly synchronized across multiple devices.  
- **Message Editing:** Edit your messages with visible edit indicators.  
- **Message Deletion:** Delete your messages, with real-time updates for all users.  
- **Active Participants:** View the list of users currently in the session.  
- **Emoji Picker:** Add expressive emojis to your messages! 🎉 *(Bonus Task)*  
- **Multiple Chat Rooms:** Create and join rooms for organized conversations *(Bonus Feature)*.  
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

### 🌐 **Cross-Device Testing**

- **Tested on Two Devices:**  
  I accessed the app from both a desktop and a mobile device on the **same Wi-Fi network**.  
  To enable this, I updated the WebSocket connection to use my local IP address instead of `localhost`

### 🔍 Further Testing 
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

Given more time, I would:

- **Complete E2E Testing** for message syncing across devices.  
- **Enhance the Emoji Picker** with categories and search.  
- **Implement Link Previews** for URLs shared in the chat *(Bonus Task)*.  
- **Optimize Performance** using virtualized lists for large message datasets.  
- **Add Dark Mode and Themes** to improve UX.

---

## 💬 Final Notes

All core features outlined in the requirements are fully implemented and tested.  

Additionally, I introduced **chat rooms** and an **emoji picker** to showcase my proactive approach to improving user experience.

Thank you for reviewing my work! I look forward to discussing this project in more detail. 😊

---

## 📩 Contact

**Catherina Al Skaff**  
📧 catherine.alskaf@gmail.com  
🌐 [GitHub](https://github.com/CatherineALSKFF)  
"""