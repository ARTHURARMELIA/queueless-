'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { QueueTicket } from '@/types';

interface TokenMeshProps {
  ticket: QueueTicket;
  targetPosition: [number, number, number];
  isUser: boolean;
  positionIndex: number;
  onSelect?: () => void;
}

export const TokenMesh: React.FC<TokenMeshProps> = ({
  ticket,
  targetPosition,
  isUser,
  positionIndex,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const isServing = ticket.status === 'SERVING';
  const isCalled = ticket.status === 'CALLED';
  const isCompleted = ticket.status === 'COMPLETED';

  // Determine colors based on status and user
  let coreColor = '#475569'; // Slate
  let ringColor = '#64748B';
  let emissiveColor = '#1E293B';
  let emissiveIntensity = 0.2;

  if (isUser) {
    coreColor = '#F59E0B'; // Amber / Gold for YOU
    ringColor = '#FBBF24';
    emissiveColor = '#D97706';
    emissiveIntensity = 0.8;
  } else if (isServing) {
    coreColor = '#10B981'; // Emerald
    ringColor = '#34D399';
    emissiveColor = '#059669';
    emissiveIntensity = 0.9;
  } else if (isCalled) {
    coreColor = '#00F0FF'; // Cyan
    ringColor = '#38BDF8';
    emissiveColor = '#0284C7';
    emissiveIntensity = 0.8;
  } else if (positionIndex === 0) {
    // Next in line
    coreColor = '#38BDF8';
    ringColor = '#00F0FF';
    emissiveColor = '#0369A1';
    emissiveIntensity = 0.6;
  }

  // Smooth position lerping and subtle floating animation
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth movement to target position
    const targetX = targetPosition[0];
    const targetZ = targetPosition[2];
    const hoverOffset = Math.sin(state.clock.elapsedTime * 2 + positionIndex * 0.5) * 0.08;
    const targetY = targetPosition[1] + hoverOffset;

    // Lerp factor
    const lerpSpeed = 4 * delta;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, lerpSpeed);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, lerpSpeed);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, lerpSpeed);

    // Rotate ring
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * (isUser || isServing ? 1.5 : 0.6);
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }

    // Subtle breathing pulse for core
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + positionIndex) * 0.03;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[targetPosition[0], targetPosition[1] + 1, targetPosition[2] + 4]} // initial spawn offset
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Base Pedestal */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.65, 0.75, 0.18, 32]} />
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.8}
          roughness={0.2}
          emissive={ringColor}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Futuristic Rounded Capsule Core */}
      <mesh ref={coreRef} position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.38, 0.65, 16, 32]} />
        <meshStandardMaterial
          color={coreColor}
          metalness={0.4}
          roughness={0.25}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Orbiting Halo Ring */}
      <mesh ref={ringRef} position={[0, 0.1, 0]}>
        <torusGeometry args={[0.75, 0.025, 16, 64]} />
        <meshStandardMaterial
          color={ringColor}
          emissive={ringColor}
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Additional Concentric Locator Ring for the USER */}
      {isUser && (
        <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.05, 32]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Floating HTML Badge for Token & Status */}
      <Html
        position={[0, 1.35, 0]}
        center
        distanceFactor={18}
        zIndexRange={[100, 0]}
        className="pointer-events-none select-none"
      >
        <div className="flex flex-col items-center">
          {/* YOU Badge */}
          {isUser && (
            <div className="mb-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black text-[11px] font-black tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse">
              ★ YOU
            </div>
          )}

          {/* Token Card */}
          <div
            className={`px-3 py-1.5 rounded-xl border backdrop-blur-md flex items-center gap-2 shadow-2xl transition-all ${
              isUser
                ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-amber-500/30'
                : isServing
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-emerald-500/30'
                : isCalled
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-cyan-500/30'
                : 'bg-[#0E131F]/90 border-white/15 text-white/90'
            }`}
          >
            <span className="font-mono font-black text-sm tracking-tight">
              #{ticket.token_number}
            </span>
            <span
              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded tracking-wider ${
                isUser
                  ? 'bg-amber-400 text-black font-bold'
                  : isServing
                  ? 'bg-emerald-400 text-black font-bold'
                  : isCalled
                  ? 'bg-cyan-400 text-black font-bold'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              {ticket.status}
            </span>
          </div>

          <div className="text-[11px] font-medium text-white/70 mt-1 max-w-[120px] truncate text-center drop-shadow">
            {ticket.user_name.replace(' (You)', '')}
          </div>
        </div>
      </Html>
    </group>
  );
};
