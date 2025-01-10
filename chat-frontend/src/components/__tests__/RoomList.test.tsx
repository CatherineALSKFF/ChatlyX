import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomList from '../RoomList';

const mockJoinRoom = jest.fn();
const mockCreateRoom = jest.fn();
const mockSetNewRoomName = jest.fn();

const mockRooms = [
  { id: '1', name: 'General', unreadCount: 2 },
  { id: '2', name: 'Random', unreadCount: 0 },
];

const setup = (currentRoomId: string | null = null) => {
  render(
    <RoomList
      rooms={mockRooms}
      currentRoom={mockRooms.find((room) => room.id === currentRoomId) || null}
      joinRoom={mockJoinRoom}
      createRoom={mockCreateRoom}
      newRoomName=""
      setNewRoomName={mockSetNewRoomName}
    />
  );
};

describe('RoomList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('renders the room list with available rooms', () => {
    setup();

    expect(screen.getByText('Chat Rooms')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Random')).toBeInTheDocument();
  });

  it('displays unread message count for rooms', () => {
    setup();

    expect(screen.getByText('(2 new)')).toBeInTheDocument();
    expect(screen.queryByText('(0 new)')).not.toBeInTheDocument();
  });

  it('calls joinRoom when a room is clicked', () => {
    setup();

    const generalRoom = screen.getByRole('button', { name: /join general room/i });
    fireEvent.click(generalRoom);

    expect(mockJoinRoom).toHaveBeenCalledTimes(1);
    expect(mockJoinRoom).toHaveBeenCalledWith('1');
  });

  it('toggles the room creation input when the add icon is clicked', () => {
    setup();

    const addRoomButton = screen.getByLabelText('Add a new chat room');
    fireEvent.click(addRoomButton);

    expect(screen.getByLabelText('Enter new room name')).toBeInTheDocument();
    expect(screen.getByLabelText('Create chat room')).toBeInTheDocument();
  });

  it('calls createRoom when the create button is clicked', () => {
    setup();

    const addRoomButton = screen.getByLabelText('Add a new chat room');
    fireEvent.click(addRoomButton);

    const input = screen.getByLabelText('Enter new room name');
    const createButton = screen.getByLabelText('Create chat room');

    fireEvent.change(input, { target: { value: 'New Room' } });
    fireEvent.click(createButton);

    expect(mockSetNewRoomName).toHaveBeenCalledWith('New Room');
    expect(mockCreateRoom).toHaveBeenCalledTimes(1);
  });

  it('highlights the active room', () => {
    setup('1'); // Pass "1" as the current active room

    const activeRoom = screen.getByRole('button', { name: /join general room/i });
    expect(activeRoom).toHaveClass('active');
  });
});
