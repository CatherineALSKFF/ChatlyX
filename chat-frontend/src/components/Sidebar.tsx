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
    <div className={styles.sidebar}>
      <div className={styles.title}>CHATLY X</div>
      <hr className={styles.separator} />

      {/* Rooms Section */}
      <div className={styles.section}>
        <h3 className={styles.roomHeader}>
          Chat Rooms
          <img
            src="/icons/plus-icon.svg"
            alt="Create Room"
            className={styles.plusIcon}
            onClick={() => setShowCreateRoom((prev) => !prev)}
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
            />
            <button onClick={createRoom} className={styles.createRoomButton}>
              Create
            </button>
          </div>
        )}
        <ul className={styles.list}>
          {roomList.map((room) => (
            <li
              key={room.id}
              className={`${styles.listItem} ${
                currentRoom?.id === room.id ? styles.active : ''
              }`}
              onClick={() => joinRoom(room.id)}
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
      <div className={styles.section}>
        <h3>Participants</h3>
        <ul className={styles.list}>
          {participants.map((participant) => (
            <li key={participant.id} className={styles.participant}>
              {participant.username}{' '}
              {participant.username === currentUsername && (
                <span className={styles.meTag}>(me)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
