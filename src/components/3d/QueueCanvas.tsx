'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Fallback2DQueue } from './Fallback2DQueue';
import { QueueTicket } from '@/types';
import { Layers, Box, Loader2 } from 'lucide-react';

interface QueueCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  tickets?: QueueTicket[];
  userTokenNumber?: number;
  showModeToggle?: boolean;
  enableOrbit?: boolean;
}

class CanvasErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('3D Canvas encountered an error, falling back to 2D:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const QueueCanvas: React.FC<QueueCanvasProps> = ({
  children,
  cameraPosition = [0, 4.5, 14],
  fov = 42,
  tickets = [],
  userTokenNumber,
  showModeToggle = true,
  enableOrbit = true,
}) => {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');

  useEffect(() => {
    setMounted(true);
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        setViewMode('2D');
      }
    } catch {
      setHasWebGL(false);
      setViewMode('2D');
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[360px] rounded-2xl bg-[#090D14] border border-white/5 flex flex-col items-center justify-center text-white/40 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        <span className="text-xs font-mono tracking-wider">INITIALIZING 3D ENVIRONMENT...</span>
      </div>
    );
  }

  if (!hasWebGL || viewMode === '2D') {
    return (
      <div className="relative w-full">
        {hasWebGL && showModeToggle && (
          <button
            onClick={() => setViewMode('3D')}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-mono text-cyan-300 transition-colors shadow-lg"
          >
            <Box className="w-3.5 h-3.5" /> Switch to 3D View
          </button>
        )}
        <Fallback2DQueue tickets={tickets} userTokenNumber={userTokenNumber} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden bg-[#07090E] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] group">
      {/* 2D/3D Mode Switcher Button */}
      {showModeToggle && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setViewMode((prev) => (prev === '3D' ? '2D' : '3D'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 text-xs font-mono text-white/80 hover:text-cyan-300 transition-all shadow-md"
            title="Toggle between 3D Spatial and 2D Linear view"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{viewMode === '3D' ? '2D View' : '3D View'}</span>
          </button>
        </div>
      )}

      {/* Interactive Hint */}
      <div className="absolute bottom-3 left-4 z-10 pointer-events-none text-[10px] font-mono text-white/40 tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>DYNAMIC 3D QUEUE • REAL-TIME MESH</span>
      </div>

      <CanvasErrorBoundary
        fallback={<Fallback2DQueue tickets={tickets} userTokenNumber={userTokenNumber} />}
      >
        <Canvas
          camera={{ position: cameraPosition, fov }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            {children}
            {enableOrbit && (
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 4}
                maxAzimuthAngle={Math.PI / 8}
                minAzimuthAngle={-Math.PI / 8}
              />
            )}
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};
