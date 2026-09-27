'use client';

import React from 'react';
import { Html } from '@react-three/drei';

interface CounterMeshProps {
  counterNumber?: number;
  counterName?: string;
  servingToken?: number | null;
  position?: [number, number, number];
}

export const CounterMesh: React.FC<CounterMeshProps> = ({
  counterNumber = 1,
  counterName = 'Counter 1 (Room 101)',
  servingToken = null,
  position = [0, 0, 0],
}) => {
  return (
    <group position={position}>
      {/* Main Service Desk Console */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[4.4, 0.9, 1.4]} />
        <meshStandardMaterial
          color="#0F1420"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Desk Top Surface Surface Lip */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[4.6, 0.08, 1.6]} />
        <meshStandardMaterial
          color="#161F30"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>

      {/* Glowing Cyan Front Architectural Inset */}
      <mesh position={[0, 0.45, 0.72]}>
        <boxGeometry args={[3.8, 0.5, 0.04]} />
        <meshStandardMaterial
          color="#001824"
          emissive="#00F0FF"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Underglow Ground Light Strip */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[4.2, 0.02, 1.2]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Floating Overhead Hologram Billboard Display */}
      <Html
        position={[0, 2.3, 0]}
        center
        distanceFactor={18}
        className="pointer-events-none select-none"
      >
        <div className="flex flex-col items-center">
          <div className="px-5 py-2.5 rounded-2xl bg-[#090D16]/95 border border-cyan-400/50 backdrop-blur-xl shadow-[0_0_40px_rgba(0,240,255,0.25)] flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center font-mono font-black text-cyan-300 text-sm">
              0{counterNumber}
            </div>

            <div className="text-left">
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                Service Desk
              </div>
              <div className="text-white text-xs font-semibold whitespace-nowrap">
                {counterName}
              </div>
            </div>

            <div className="h-6 w-px bg-white/10" />

            <div className="text-right">
              <div className="text-[9px] font-mono tracking-wider text-white/50 uppercase">
                Now Serving
              </div>
              <div className="text-emerald-400 font-mono font-black text-base leading-none">
                {servingToken ? `#${servingToken}` : 'IDLE'}
              </div>
            </div>
          </div>

          {/* Hologram downward light beam indicator */}
          <div className="w-1 h-3 bg-gradient-to-b from-cyan-400/50 to-transparent" />
        </div>
      </Html>
    </group>
  );
};
