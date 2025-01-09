import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/components/MessageList.module.css';

type Message = {
  id: string;
  timestamp: number;
  text: string;
  user: string;
  edited?: boolean;
  deleted?: boolean;
};

type MessageListProps = {
  messages: Message[];
  startEditingMessage: (id: string, text: string) => void;
  deleteMessage: (id: string) => void;
  editingMessageId: string | null;
  editingText: string;
  setEditingText: (text: string) => void;
  saveEditedMessage: () => void;
  currentUsername: string;
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  startEditingMessage,
  deleteMessage,
  editingMessageId,
  editingText,
  setEditingText,
  saveEditedMessage,
  currentUsername,
}) => {
  const messageListRef = useRef<HTMLDivElement>(null);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setVisibleMenuId(null); // Close menu if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMenuAction = (action: 'edit' | 'delete', msgId: string, text?: string) => {
    if (action === 'edit' && text) {
      startEditingMessage(msgId, text);
    } else if (action === 'delete') {
      deleteMessage(msgId);
    }
    setVisibleMenuId(null); // Close menu after action
  };

  const isCurrentUser = (user: string) => user === currentUsername;

  return (
    <div className={styles.messageList} ref={messageListRef}>
      {messages.map((msg) => {
        const rowClass = isCurrentUser(msg.user)
          ? styles.currentUserRow
          : styles.otherUserRow;

        return (
          <div key={msg.id} className={`${styles.messageRow} ${rowClass}`}>
            <div
              className={`${styles.message} ${
                isCurrentUser(msg.user) ? styles.currentUser : styles.otherUser
              }`}
            >
              {isCurrentUser(msg.user) && (
                <>
                  <img
                    src="/icons/menu-icon.svg"
                    alt="Menu"
                    className={styles.menuIcon}
                    onClick={() =>
                      setVisibleMenuId((prevId) => (prevId === msg.id ? null : msg.id))
                    }
                  />
                  {visibleMenuId === msg.id && (
                    <div className={styles.menuOptions} ref={menuRef}>
                      <button
                        onClick={() => handleMenuAction('edit', msg.id, msg.text)}
                        disabled={msg.deleted} // Disable if message is deleted
                        className={msg.deleted ? styles.disabledButton : ''}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleMenuAction('delete', msg.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
              {editingMessageId === msg.id ? (
                <div className={styles.editContainer}>
                  <div className={styles.editPopup}>
                    <img
                      src="/icons/exit-icon.svg"
                      alt="Close"
                      className={styles.popupCloseIcon}
                      onClick={() => {
                        setEditingText(''); // Clear the text
                        setVisibleMenuId(null); // Close menu
                        startEditingMessage('', ''); // Exit editing mode
                      }}
                    />
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className={styles.editInput}
                      placeholder="Edit your message..."
                    />
                    <button
                      onClick={saveEditedMessage}
                      className={styles.saveButton}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className={styles.senderName}>{msg.user}</p>
                  <p className={styles.messageContent}>
                    {msg.deleted ? (
                      <span className={styles.deletedMessage}>
                        Message deleted
                      </span>
                    ) : (
                      msg.text
                    )}
                    {msg.edited && (
                      <span className={styles.editedTag}> (edited)</span>
                    )}
                  </p>
                  <div className={styles.timestampHover}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
