'use client';

import { Canvas } from '@react-three/fiber';
import { useMemo, useState } from 'react';

type Region = {
  name: string;
  x: number;
  y: number;
  z: number;
  growth: number;
  competition: number;
};

const REGIONS: Region[] = [
  { name: 'North America', x: -1.6, y: 0.5, z: 0.3, growth: 1.2, competition: 0.74 },
  { name: 'Europe', x: -0.1, y: 0.7, z: 0.9, growth: 1.05, competition: 0.88 },
  { name: 'MENA', x: 0.3, y: 0.3, z: 1, growth: 1.18, competition: 0.52 },
  { name: 'Asia Pacific', x: 1.35, y: 0.2, z: 0.5, growth: 1.38, competition: 0.91 },
  { name: 'Latin America', x: -1.15, y: -0.85, z: 0.35, growth: 1.27, competition: 0.57 },
  { name: 'Africa', x: 0.25, y: -0.55, z: 0.86, growth: 1.34, competition: 0.41 },
];

function RegionMarkers({ active }: { active: number }) {
  return (
    <>
      <mesh>
        <sphereGeometry args={[1.2, 42, 42]} />
        <meshStandardMaterial color="#1d4ed8" wireframe />
      </mesh>
      {REGIONS.map((region, index) => (
        <mesh key={region.name} position={[region.x, region.y, region.z]}>
          <sphereGeometry args={[active === index ? 0.07 : 0.045, 16, 16]} />
          <meshStandardMaterial color={active === index ? '#f59e0b' : '#93c5fd'} />
        </mesh>
      ))}
    </>
  );
}

export default function MapPage() {
  const [active, setActive] = useState(0);

  const activeRegion = useMemo(() => REGIONS[active], [active]);

  const handleScroll = (delta: number) => {
    setActive((current) => {
      if (delta > 0) return (current + 1) % REGIONS.length;
      return (current - 1 + REGIONS.length) % REGIONS.length;
    });
  };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl mb-1">World Map 3D</h1>
      <p className="text-sm opacity-80">Utilise la molette (scroll) dans la carte pour naviguer entre les régions.</p>
      <div
        className="h-96 card"
        onWheel={(event) => {
          event.preventDefault();
          handleScroll(event.deltaY);
        }}
      >
        <Canvas camera={{ position: [0, 0, 3.2], fov: 55 }}>
          <ambientLight intensity={1} />
          <directionalLight intensity={1} position={[2, 1, 2]} />
          <RegionMarkers active={active} />
        </Canvas>
      </div>

      <div className="card">
        <div className="font-semibold">Région active : {activeRegion.name}</div>
        <div className="text-sm mt-2">Growth signal: {activeRegion.growth.toFixed(2)}x</div>
        <div className="text-sm">Competition signal: {(activeRegion.competition * 100).toFixed(0)}%</div>
      </div>
    </div>
  );
}
