import React, { useState, useEffect } from 'react';
import styles from '../styles/components/Sidebar.module.css';

type Room = {
  id: string;
  name: string;
  unreadCount: number;
};

type Participant = {
  id: string;
  username: string;
};

type SidebarProps = {
  rooms: Room[];
  participants: Participant[];
  currentRoom: Room | null;
  joinRoom: (roomId: string) => void;
  createRoom: () => void;
  newRoomName: string;
  setNewRoomName: (name: string) => void;
  currentUsername: string; // Add the logged-in user's username
};

const Sidebar: React.FC<SidebarProps> = ({
  rooms,
  participants,
  currentRoom,
  joinRoom,
  createRoom,
  newRoomName,
  setNewRoomName,
  currentUsername,
}) => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  // Ensure "Main Chat" is always displayed
  // const defaultRoom = { id: 'main-chat', name: 'Main Chat', unreadCount: 0 };

  // Merge "Main Chat" with dynamically created rooms
  const roomList = [ ...rooms];

  return (
    <aside className={styles.sidebar} aria-label="Sidebar">
      <div className={styles.title}>CHATLY X</div>
      <hr className={styles.separator} />

      {/* Rooms Section */}
      <div className={styles.section} aria-labelledby="chat-rooms-heading">
        <h3 className={styles.roomHeader}>
          Chat Rooms
          <img
            src="/icons/plus-icon.svg"
            alt="Create Room"
            className={styles.plusIcon}
            onClick={() => setShowCreateRoom((prev) => !prev)}
            aria-label="Create a new chat room"
          />
        </h3>
        {showCreateRoom && (
          <div className={styles.createRoom}>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room name"
              className={styles.roomInput}
              aria-label="Room name input"
            />
            <button onClick={createRoom} className={styles.createRoomButton} aria-label="Confirm room creation">
              Create
            </button>
          </div>
        )}
        <ul className={styles.list} aria-label="List of available chat rooms">
          {roomList.map((room) => (
            <li
              key={room.id}
              className={`${styles.listItem} ${
                currentRoom?.id === room.id ? styles.active : ''
              }`}
              onClick={() => joinRoom(room.id)}
              role="button"
              aria-pressed={currentRoom?.id === room.id}
              aria-label={`Join ${room.name} room${room.unreadCount > 0 ? `, ${room.unreadCount} new messages` : ''}`}
            >
              {room.name}
              {room.unreadCount > 0 && currentRoom?.id !== room.id && (
                <span className={styles.unread}>({room.unreadCount} new)</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <hr className={styles.sectionSeparator} />

      {/* Participants Section */}
      <div className={styles.section} aria-labelledby="participants-heading">
        <h3>  Participants ({participants.filter(p => p.username).length})</h3>
        <ul className={styles.list} aria-label="List of participants">
          {participants.map((participant) => (
            <li key={participant.id} className={styles.participant}  aria-label={`${participant.username} ${participant.username === currentUsername ? '(You)' : ''}`}>
              {participant.username}{' '}
              {participant.username === currentUsername && (
                <span className={styles.meTag}>(me)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
