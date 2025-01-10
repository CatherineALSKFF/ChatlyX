import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';

const mockToggleRoomList = jest.fn();
const mockSetView = jest.fn();

const mockCurrentRoom = {
  id: '1',
  name: 'General Chat',
  unreadCount: 2,
};

const setup = (view: 'participants' | 'chat' = 'chat') => {
  render(
    <Navbar
      currentRoom={mockCurrentRoom}
      view={view}
      setView={mockSetView}
      toggleRoomList={mockToggleRoomList}
    />
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mock calls before each test
  });

  it('renders Navbar with current room name', () => {
    setup();

    expect(screen.getByText('CHATLY X')).toBeInTheDocument();
    expect(screen.getByText('General Chat')).toBeInTheDocument();
  });

  it('calls toggleRoomList when room name is clicked', () => {
    setup();

    const roomName = screen.getByLabelText('Toggle room list');
    fireEvent.click(roomName);

    expect(mockToggleRoomList).toHaveBeenCalledTimes(1);
  });

  it('calls toggleRoomList when the arrow icon is clicked', () => {
    setup();

    const arrowIcon = screen.getByLabelText('Dropdown to view or create chat rooms');
    fireEvent.click(arrowIcon);

    expect(mockToggleRoomList).toHaveBeenCalledTimes(1);
  });

  it('switches to participants view when Participants button is clicked', () => {
    setup();

    const participantsButton = screen.getByLabelText('Switch to participants view');
    fireEvent.click(participantsButton);

    expect(mockSetView).toHaveBeenCalledWith('participants');
  });

  it('switches to chat view when Chat button is clicked', () => {
    setup('participants'); // Start on participants view

    const chatButton = screen.getByLabelText('Switch to chat view');
    fireEvent.click(chatButton);

    expect(mockSetView).toHaveBeenCalledWith('chat');
  });

  it('highlights the active view button', () => {
    setup('participants');

    const participantsButton = screen.getByLabelText('Switch to participants view');
    const chatButton = screen.getByLabelText('Switch to chat view');

    expect(participantsButton).toHaveClass('active');
    expect(chatButton).not.toHaveClass('active');
  });
});
