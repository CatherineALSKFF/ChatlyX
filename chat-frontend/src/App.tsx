import React, { useState, useEffect } from 'react';
import ParticipantsList from './components/ParticipantsList';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RoomList from './components/RoomList';
import './styles/global.css';

type Message = {
  id: string;
  timestamp: number;
  text: string;
  user: string;
  edited?: boolean;
  deleted?: boolean;
};

type Participant = {
  id: string;
  username: string;
};

type Room = {
  id: string;
  name: string;
  unreadCount: number;
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [view, setView] = useState<'participants' | 'chat'>('chat');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isRoomListOpen, setIsRoomListOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

useEffect(() => {
  ws.current = new WebSocket('ws://localhost:8080');

  ws.current.onopen = () => {
    console.log('Connected to WebSocket server');
    setIsConnected(true);
  };

  return () => {
    ws.current?.close();
  };
}, []);


  const ws = React.useRef<WebSocket | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'participants-updated':
          setParticipants(data.participants);
          break;
        case 'room-list-updated':
          setRooms(data.rooms);
          break;
        case 'room-joined':
          setCurrentRoom({ id: data.roomId, name: data.roomName, unreadCount: 0 });
          setMessages(data.messages);
          break;
        case 'new-message':
          setMessages((prev) => [
            ...prev,
            { id: data.id, timestamp: data.timestamp, text: data.text, user: data.user },
          ]);
          break;
        case 'edit-message':
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === data.id ? { ...msg, text: data.text, edited: true } : msg
            )
          );
          break;
        case 'delete-message':
          setMessages((prev) =>
            prev.map((msg) => (msg.id === data.id ? { ...msg, deleted: true } : msg))
          );
          break;
        default:
          console.log('Unknown event type:', data.type);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendUsername = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'set-username', username }));
      setIsUsernameSet(true);
    }
  };

  const joinRoom = (roomId: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'join-room', roomId }));
      setIsRoomListOpen(false); // Close the room list after joining a room
    }
  };
  

  const createRoom = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && newRoomName.trim()) {
      ws.current.send(JSON.stringify({ type: 'create-room', roomName: newRoomName }));
      setNewRoomName('');
    }
  };

  const toggleRoomList = () => {
    setIsRoomListOpen((prev) => !prev);
  };
  const sendMessage = (text: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && currentRoom) {
      ws.current.send(JSON.stringify({ type: 'new-message', text, roomId: currentRoom.id }));
    }
  };

  

  return (
<div
      className={`appContainer ${isMobile ? 'mobile' : 'desktop'}`}
      role="application"
      aria-label="Chatly X Application"
    >
      {isUsernameSet && !isMobile && (
        <div className="sidebarContainer" role="complementary" aria-label="Sidebar">
          <Sidebar
            rooms={rooms}
            currentUsername={username}
            participants={participants}
            currentRoom={currentRoom}
            joinRoom={joinRoom}
            createRoom={createRoom}
            newRoomName={newRoomName}
            setNewRoomName={setNewRoomName}
          />
        </div>
      )}
      <div
        className={`contentContainer ${isMobile ? 'mobileContent' : 'desktopContent'}`}
        role="main"
        aria-label="Main Content"
      >
        {!isUsernameSet ? (
          <div className="usernameContainer" role="region" aria-labelledby="choose-username">
            <h1 id="choose-username">Choose a username</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendUsername();
              }}
              aria-label="Username Selection Form"
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                aria-label="Enter your username"
                required
              />
              <button type="submit" className="join-btn" aria-label="Join Chat">
                Join
              </button>
            </form>
          </div>
        ) : (
          <>
            {isMobile && currentRoom && (
              <Navbar
                currentRoom={currentRoom}
                view={view}
                setView={setView}
                toggleRoomList={toggleRoomList}
              />
            )}
            {isMobile && isRoomListOpen && (
              <div
                className="roomListContainer"
                role="dialog"
                aria-label="Room List"
              >
                <RoomList
                  rooms={rooms}
                  currentRoom={currentRoom}
                  joinRoom={joinRoom}
                  createRoom={createRoom}
                  newRoomName={newRoomName}
                  setNewRoomName={setNewRoomName}
                />
              </div>
            )}
            {currentRoom && (
              <div className="mainContent" role="region" aria-labelledby="chat-region">
                {view === 'participants' ? (
                  <ParticipantsList participants={participants} />
                ) : (
                  <>
                    <MessageList
                      messages={messages}
                      startEditingMessage={(id, text) => {
                        setEditingMessageId(id);
                        setEditingText(text);
                      }}
                      deleteMessage={(id) => {
                        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                          ws.current.send(JSON.stringify({ type: 'delete-message', id }));
                        }
                      }}
                      editingMessageId={editingMessageId}
                      editingText={editingText}
                      setEditingText={setEditingText}
                      saveEditedMessage={() => {
                        if (
                          ws.current &&
                          ws.current.readyState === WebSocket.OPEN &&
                          editingMessageId
                        ) {
                          ws.current.send(
                            JSON.stringify({
                              type: 'edit-message',
                              id: editingMessageId,
                              text: editingText,
                            })
                          );
                          setEditingMessageId(null);
                          setEditingText('');
                        }
                      }}
                      currentUsername={username}
                    />
                    <MessageInput sendMessage={sendMessage} />
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
