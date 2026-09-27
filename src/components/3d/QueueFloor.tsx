'use client';

import React from 'react';
import { Grid } from '@react-three/drei';

interface QueueFloorProps {
  queueLength?: number;
}

export const QueueFloor: React.FC<QueueFloorProps> = ({ queueLength = 8 }) => {
  return (
    <group position={[0, -0.65, 0]}>
      {/* Subtle floor grid */}
      <Grid
        position={[0, 0, 8]}
        args={[30, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1E293B"
        sectionSize={4}
        sectionThickness={1}
        sectionColor="#00F0FF"
        fadeDistance={28}
        fadeStrength={1.5}
      />

      {/* Runway center line */}
      <mesh position={[0, 0.01, 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 26]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.3} />
      </mesh>

      {/* Position guide hashes */}
      {Array.from({ length: queueLength }).map((_, i) => {
        const zPos = 2.5 + i * 2.8;
        return (
          <group key={i} position={[0, 0.02, zPos]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.7, 0.74, 32]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.15} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
