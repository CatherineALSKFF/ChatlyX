import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageList from '../MessageList';

const mockMessages = [
  { id: '1', timestamp: Date.now(), text: 'Hello World', user: 'User1' },
  { id: '2', timestamp: Date.now(), text: 'Hello Again', user: 'CurrentUser' },
];

const setup = (overrideProps = {}) => {
  const defaultProps = {
    messages: mockMessages,
    startEditingMessage: jest.fn(),
    deleteMessage: jest.fn(),
    editingMessageId: null,
    editingText: '',
    setEditingText: jest.fn(),
    saveEditedMessage: jest.fn(),
    currentUsername: 'CurrentUser',
    ...overrideProps,
  };

  render(<MessageList {...defaultProps} />);
  return defaultProps;
};

describe('MessageList Component', () => {
  it('renders messages correctly', () => {
    setup();

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Hello Again')).toBeInTheDocument();
  });

  it('shows Edit and Delete buttons for current user messages', () => {
    setup();

    // Using getAllByRole instead of getAllByAltText
    const menuIcons = screen.getAllByRole('img', { name: /open message options/i });
    expect(menuIcons.length).toBeGreaterThan(0);

    fireEvent.click(menuIcons[0]); // Open the menu for the current user's message

    expect(screen.getByRole('button', { name: /edit this message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete this message/i })).toBeInTheDocument();
  });

  it('calls startEditingMessage when Edit is clicked', () => {
    const { startEditingMessage } = setup();

    const menuIcons = screen.getAllByRole('img', { name: /open message options/i });
    fireEvent.click(menuIcons[0]);

    const editButton = screen.getByRole('button', { name: /edit this message/i });
    fireEvent.click(editButton);

    expect(startEditingMessage).toHaveBeenCalledWith('2', 'Hello Again');
  });

  it('calls deleteMessage when Delete is clicked', () => {
    const { deleteMessage } = setup();

    const menuIcons = screen.getAllByRole('img', { name: /open message options/i });
    fireEvent.click(menuIcons[0]);

    const deleteButton = screen.getByRole('button', { name: /delete this message/i });
    fireEvent.click(deleteButton);

    expect(deleteMessage).toHaveBeenCalledWith('2');
  });

  it('displays the edit input when editing a message', () => {
    setup({ editingMessageId: '2', editingText: 'Updated Text' });

    const editInput = screen.getByPlaceholderText('Update your message...');
    expect(editInput).toBeInTheDocument();
    expect(editInput).toHaveValue('Updated Text');
  });

  it('has proper ARIA labels for accessibility', () => {
    setup();

    // Ensure the message has the correct ARIA label
    expect(screen.getByLabelText('Message from User1')).toBeInTheDocument();
    expect(screen.getByLabelText('Message from CurrentUser')).toBeInTheDocument();
  });
});
