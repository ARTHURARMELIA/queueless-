'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CounterMesh } from './CounterMesh';
import { TokenMesh } from './TokenMesh';
import { QueueFloor } from './QueueFloor';
import { QueueTicket } from '@/types';

interface HeroQueueSceneProps {
  tickets: QueueTicket[];
  servingToken?: number | null;
  onSelectToken?: (ticket: QueueTicket) => void;
}

export const HeroQueueScene: React.FC<HeroQueueSceneProps> = ({
  tickets,
  servingToken,
  onSelectToken,
}) => {
  const sceneGroupRef = useRef<THREE.Group>(null);

  // Active tickets in line
  const activeTickets = tickets.filter(
    (t) => t.status === 'SERVING' || t.status === 'CALLED' || t.status === 'WAITING'
  );

  // Subtle mouse parallax effect
  useFrame((state) => {
    if (!sceneGroupRef.current) return;
    const { x, y } = state.pointer;
    // Gentle rotation based on mouse coordinates
    sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      sceneGroupRef.current.rotation.y,
      x * 0.12,
      0.05
    );
    sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      sceneGroupRef.current.rotation.x,
      -y * 0.05,
      0.05
    );
  });

  return (
    <group ref={sceneGroupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#E0F2FE" />
      <pointLight position={[0, 4, 0]} intensity={2.5} color="#00F0FF" distance={15} />
      <pointLight position={[0, 3, 10]} intensity={1.5} color="#38BDF8" distance={20} />

      {/* Service Counter Desk at origin */}
      <CounterMesh
        counterNumber={1}
        counterName="Counter 1 (Room 101)"
        servingToken={servingToken}
        position={[0, 0, 0]}
      />

      {/* Grid Floor and Guideway */}
      <QueueFloor queueLength={Math.max(8, activeTickets.length)} />

      {/* Tokens along the queue line */}
      {activeTickets.map((ticket, index) => {
        const isServing = ticket.status === 'SERVING';
        // If serving, placed right in front of desk [0, 0, 2.2]
        // If called / next, position 1 [0, 0, 5.0]
        // Else position N [0, 0, 2.2 + index * 2.8]
        const zPos = isServing ? 2.2 : 2.2 + index * 2.8;
        const isUser = ticket.token_number === 42 || ticket.user_name.includes('(You)');

        return (
          <TokenMesh
            key={ticket.id}
            ticket={ticket}
            targetPosition={[0, 0, zPos]}
            isUser={isUser}
            positionIndex={index}
            onSelect={() => onSelectToken?.(ticket)}
          />
        );
      })}
    </group>
  );
};
