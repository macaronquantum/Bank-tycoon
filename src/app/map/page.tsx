'use client';
import { Canvas } from '@react-three/fiber';
export default function MapPage(){return <div><h1 className='text-2xl mb-3'>World Map 3D</h1><div className='h-96 card'><Canvas><ambientLight/><mesh position={[0,0,0]}><boxGeometry args={[1,1,1]}/><meshStandardMaterial color='royalblue'/></mesh></Canvas></div></div>}
