import React, { useState } from 'react';
import styles from '../styles/components/MessageInput.module.css';

type MessageInputProps = {
  sendMessage: (text: string) => void;
};

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className={styles.messageInput}
      />
      <button onClick={handleSend} className={styles.sendButton}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
