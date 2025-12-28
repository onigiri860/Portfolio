'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

// 回転する箱のコンポーネント
function RotatingBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // 毎フレーム実行されるループ (アニメーション)
  useFrame((state, delta) => {
    if (meshRef.current) {
      // ふわふわ浮遊させる
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime) * 0.1;
      // ゆっくり回転させる
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      {/* 角丸のボックスに変更 (よりモダンに) */}
      <boxGeometry args={[1, 1, 1]} />
      {/* 色をサイトのテーマカラー(Sky Blue)に合わせる、少しメタリックに */}
      <meshStandardMaterial color="#0ea5e9" roughness={0.3} metalness={0.8} />
    </mesh>
  );
}

// ローディング中に表示するコンポーネント
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="gray" wireframe />
    </mesh>
  );
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [4, 2, 5], fov: 50 }}
      shadows
      dpr={[1, 2]} // 解像度調整（Retina対応）
    >
      {/* 背景色: 薄いグレー */}
      <color attach="background" args={['#f5f7fa']} />
      
      {/* 環境光: 明るく反射が綺麗な設定 */}
      <Environment preset="city" />

      {/* 3Dコンテンツエリア */}
      <Suspense fallback={<Loader />}>
        
        <RotatingBox />
        
        {/* 床に落ちる影 */}
        <ContactShadows opacity={0.4} scale={10} blur={2.5} far={4} resolution={256} color="#000000" />
      </Suspense>

      {/* カメラ操作 (自動回転を追加) */}
      <OrbitControls 
        makeDefault 
        autoRotate // 勝手にカメラが回る
        autoRotateSpeed={0.5} // ゆっくり
        enableZoom={true}
        maxPolarAngle={Math.PI / 2} // 床より下に行かないように制限
      />
    </Canvas>
  );
}