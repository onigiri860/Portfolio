'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';

// ★ここに将来 Blenderのモデル (Model.tsx) を読み込みます
// import Model from './Model';

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      shadows
    >
      {/* 背景色 */}
      <color attach="background" args={['#111']} />
      
      {/* 環境光（プリセット: city, sunset, studio など選べます） */}
      <Environment preset="city" />

      {/* 3Dコンテンツエリア */}
      <Suspense fallback={null}>
        
        {/* --- テスト用の箱（Blenderモデルを入れるまでの仮置き） --- */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        
        {/* 床に落ちる影 */}
        <ContactShadows opacity={0.5} scale={10} blur={2.5} far={4} resolution={256} color="#000000" />
      </Suspense>

      {/* カメラ操作 */}
      <OrbitControls makeDefault />
    </Canvas>
  );
}