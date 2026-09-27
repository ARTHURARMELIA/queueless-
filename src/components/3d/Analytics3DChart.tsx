'use client';

import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { HourlyAnalytics } from '@/types';

interface Analytics3DChartProps {
  data: HourlyAnalytics[];
  onSelectHour?: (hour: HourlyAnalytics) => void;
  selectedHour?: HourlyAnalytics | null;
}

const ColumnBar: React.FC<{
  item: HourlyAnalytics;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ item, index, total, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Height proportional to customers served (max ~40 -> height ~4)
  const targetHeight = Math.max(0.6, (item.customersServed / 40) * 3.8);
  const xPos = (index - total / 2) * 1.35;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const hoverScale = hovered || isSelected ? 1.08 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, hoverScale, delta * 8);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, hoverScale, delta * 8);
  });

  const barColor = isSelected
    ? '#00F0FF'
    : hovered
    ? '#38BDF8'
    : item.customersServed > 30
    ? '#0284C7'
    : '#1E293B';

  const emissiveColor = isSelected ? '#00F0FF' : hovered ? '#0284C7' : '#0B0F19';

  return (
    <group position={[xPos, 0, 0]}>
      {/* 3D Vertical Pillar */}
      <mesh
        ref={meshRef}
        position={[0, targetHeight / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.85, targetHeight, 0.85]} />
        <meshStandardMaterial
          color={barColor}
          emissive={emissiveColor}
          emissiveIntensity={isSelected ? 0.7 : hovered ? 0.4 : 0.1}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Top glowing cap */}
      <mesh position={[0, targetHeight + 0.02, 0]}>
        <boxGeometry args={[0.85, 0.04, 0.85]} />
        <meshBasicMaterial color={isSelected ? '#FFFFFF' : '#38BDF8'} />
      </mesh>

      {/* Hour label below */}
      <Html position={[0, -0.4, 0]} center distanceFactor={14} className="pointer-events-none select-none">
        <span
          className={`text-[10px] font-mono whitespace-nowrap transition-colors ${
            isSelected ? 'text-cyan-300 font-bold' : 'text-white/50'
          }`}
        >
          {item.hour}
        </span>
      </Html>

      {/* Hover / Selected Info Tooltip */}
      {(hovered || isSelected) && (
        <Html position={[0, targetHeight + 0.6, 0]} center distanceFactor={14} className="pointer-events-none select-none z-50">
          <div className="bg-[#090D16]/95 border border-cyan-400/50 backdrop-blur-md px-3 py-2 rounded-xl shadow-2xl text-center min-w-[110px]">
            <div className="text-[10px] text-cyan-400 font-mono font-bold uppercase">{item.hour}</div>
            <div className="text-white text-xs font-mono font-bold">{item.customersServed} served</div>
            <div className="text-[9px] text-white/60 font-mono mt-0.5">Wait: ~{item.avgWaitMinutes}m</div>
          </div>
        </Html>
      )}
    </group>
  );
};

export const Analytics3DChart: React.FC<Analytics3DChartProps> = ({
  data,
  onSelectHour,
  selectedHour,
}) => {
  const chartGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!chartGroupRef.current) return;
    const { x } = state.pointer;
    chartGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      chartGroupRef.current.rotation.y,
      x * 0.15,
      0.05
    );
  });

  return (
    <group ref={chartGroupRef} position={[0, -1.2, 0]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} />
      <pointLight position={[0, 4, 2]} intensity={1.5} color="#00F0FF" />

      {/* Ground plane */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 6]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.8} />
      </mesh>

      {/* Grid Lines */}
      {data.map((item, index) => (
        <ColumnBar
          key={item.hour}
          item={item}
          index={index}
          total={data.length}
          isSelected={selectedHour?.hour === item.hour}
          onSelect={() => onSelectHour?.(item)}
        />
      ))}
    </group>
  );
};
