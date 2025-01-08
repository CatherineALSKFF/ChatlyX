import React, { useState, useEffect } from 'react';
import ParticipantsList from './components/ParticipantsList';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import RoomList from './components/RoomList';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
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
  unreadCount: number; // Unread message count for each room
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
  const ws = React.useRef<WebSocket | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  const createRoom = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && newRoomName.trim()) {
      ws.current.send(JSON.stringify({ type: 'create-room', roomName: newRoomName }));
      setNewRoomName('');
    }
  };

  const joinRoom = (roomId: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'join-room', roomId }));
    }
  };

  const sendMessage = (text: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && currentRoom) {
      ws.current.send(JSON.stringify({ type: 'new-message', text, roomId: currentRoom.id }));
    }
  };

  const startEditingMessage = (id: string, text: string) => {
    setEditingMessageId(id);
    setEditingText(text);
  };

  const saveEditedMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && editingMessageId) {
      ws.current.send(JSON.stringify({ type: 'edit-message', id: editingMessageId, text: editingText }));
      setEditingMessageId(null);
      setEditingText('');
    }
  };

  const deleteMessage = (id: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'delete-message', id }));
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {isUsernameSet && !isMobile && (
        <Sidebar
          rooms={rooms}
          participants={participants}
          currentRoom={currentRoom}
          joinRoom={joinRoom}
        />
      )}
      <div style={{ flex: 1 }}>
        {!isUsernameSet ? (
          <div>
            <h1>Choose a Username</h1>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={sendUsername}>Join</button>
          </div>
        ) : (
          <div>
            {currentRoom && isMobile && (
              <Navbar
                currentRoom={currentRoom.name}
                view={view}
                setView={setView}
              />
            )}
            {currentRoom && (
              <>
                {view === 'participants' ? (
                  <ParticipantsList participants={participants} />
                ) : (
                  <>
                    <MessageList
                      messages={messages}
                      startEditingMessage={startEditingMessage}
                      deleteMessage={deleteMessage}
                      editingMessageId={editingMessageId}
                      editingText={editingText}
                      setEditingText={setEditingText}
                      saveEditedMessage={saveEditedMessage}
                      currentUsername={username}
                    />
                    <MessageInput sendMessage={sendMessage} />
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
