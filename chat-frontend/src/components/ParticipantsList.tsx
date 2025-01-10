import React from 'react';

type Participant = {
  id: string;
  username: string;
};

type ParticipantsListProps = {
  participants: Participant[];
};

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  return (
    <div aria-label="Participants list">
      {participants.map((p) => (
        <p key={p.id} className='list-item-participant' >{p.username}</p>
      ))}
    </div>
  );
};

export default ParticipantsList;
