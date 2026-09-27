'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CounterMesh } from './CounterMesh';
import { TokenMesh } from './TokenMesh';
import { QueueFloor } from './QueueFloor';
import { QueueTicket } from '@/types';

interface CustomerQueueSceneProps {
  tickets: QueueTicket[];
  userTicketId: string;
  servingToken?: number | null;
  counterName?: string;
}

export const CustomerQueueScene: React.FC<CustomerQueueSceneProps> = ({
  tickets,
  userTicketId,
  servingToken,
  counterName = 'Counter 1 (Room 101)',
}) => {
  const sceneGroupRef = useRef<THREE.Group>(null);

  // Active tickets in line
  const activeTickets = tickets.filter(
    (t) => t.status === 'SERVING' || t.status === 'CALLED' || t.status === 'WAITING'
  );

  // Gentle floating camera/group motion
  useFrame((state) => {
    if (!sceneGroupRef.current) return;
    const { x, y } = state.pointer;
    sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      sceneGroupRef.current.rotation.y,
      x * 0.08,
      0.04
    );
    sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      sceneGroupRef.current.rotation.x,
      -y * 0.03,
      0.04
    );
  });

  return (
    <group ref={sceneGroupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 12, 8]} intensity={1.3} color="#E0F2FE" />
      <pointLight position={[0, 4, 0]} intensity={2} color="#00F0FF" distance={15} />
      <pointLight position={[0, 3, 8]} intensity={1.8} color="#F59E0B" distance={18} />

      {/* Counter Desk */}
      <CounterMesh
        counterNumber={1}
        counterName={counterName}
        servingToken={servingToken}
        position={[0, 0, 0]}
      />

      {/* Runway Floor Grid */}
      <QueueFloor queueLength={Math.max(8, activeTickets.length)} />

      {/* Render all active tokens */}
      {activeTickets.map((ticket, index) => {
        const isUser = ticket.id === userTicketId;
        const isServing = ticket.status === 'SERVING';
        const zPos = isServing ? 2.2 : 2.2 + index * 2.8;

        return (
          <TokenMesh
            key={ticket.id}
            ticket={ticket}
            targetPosition={[0, 0, zPos]}
            isUser={isUser}
            positionIndex={index}
          />
        );
      })}
    </group>
  );
};
