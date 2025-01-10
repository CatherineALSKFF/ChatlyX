import React from 'react';
import styles from '../styles/components/Navbar.module.css';

type Room = {
  id: string;
  name: string;
  unreadCount: number;
};

type NavbarProps = {
  currentRoom: Room | null;
  view: 'participants' | 'chat';
  setView: (view: 'participants' | 'chat') => void;
  toggleRoomList: () => void; // Function to toggle room list
};

const Navbar: React.FC<NavbarProps> = ({
  currentRoom,
  view,
  setView,
  toggleRoomList,
}) => {
  return (
    <div className={styles.navbar}>
      <img
        src="/icons/chat-icon.svg"
        alt="Chat Icon"
        className={styles.navbarIcon}
        onClick={toggleRoomList} // Attach toggleRoomList function
      />
      <div className={styles.title}>{currentRoom?.name || 'No Room Selected'}</div>
      <div className={styles.navButtons}>
        <button
          className={`${styles.navButton} ${
            view === 'participants' ? styles.active : ''
          }`}
          onClick={() => setView('participants')}
        >
          Participants
        </button>
        <button
          className={`${styles.navButton} ${
            view === 'chat' ? styles.active : ''
          }`}
          onClick={() => setView('chat')}
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default Navbar;
