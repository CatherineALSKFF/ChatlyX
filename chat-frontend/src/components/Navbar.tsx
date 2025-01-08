import React from 'react';
import styles from '../styles/components/Navbar.module.css'
type NavbarProps = {
  currentRoom: string;
  view: 'participants' | 'chat';
  setView: (view: 'participants' | 'chat') => void;
};

const Navbar: React.FC<NavbarProps> = ({ currentRoom, view, setView }) => {
  return (
    <div className={styles.navbar}>
      <div className={styles.title}>{currentRoom}</div>
      <div className={styles.navButtons}>
        <button
          className={`${styles.navButton} ${view === 'participants' ? styles.active : ''}`}
          onClick={() => setView('participants')}
        >
          Participants
        </button>
        <button
          className={`${styles.navButton} ${view === 'chat' ? styles.active : ''}`}
          onClick={() => setView('chat')}
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default Navbar;
