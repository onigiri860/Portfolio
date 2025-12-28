'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  Html, 
  PointerLockControls, 
  Stars,
  PerspectiveCamera
} from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type JoystickData = { x: number; y: number };

// --- 設定データ ---
const SECTIONS = [
  { id: 'skills', name: 'SKILLS', position: [-10, 0, -10], color: '#0ea5e9', height: 6 },
  { id: 'works', name: 'WORKS', position: [10, 0, -10], color: '#f59e0b', height: 8 },
  { id: 'experience', name: 'EXPERIENCE', position: [-10, 0, 10], color: '#10b981', height: 5 },
  { id: 'volleyball', name: 'VOLLEYBALL', position: [10, 0, 10], color: '#f97316', height: 4 },
];

function Player({ joystickRef, isModalOpen }: { joystickRef: React.MutableRefObject<JoystickData>, isModalOpen: boolean }) {
  const { camera, gl } = useThree();
  
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  
  const velocity = useRef(new THREE.Vector3());
  
  // タッチ視点操作用
  const touchStart = useRef<{ x: number, y: number } | null>(null);
  const cameraEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp': case 'KeyW': moveForward.current = true; break;
        case 'ArrowLeft': case 'KeyA': moveLeft.current = true; break;
        case 'ArrowDown': case 'KeyS': moveBackward.current = true; break;
        case 'ArrowRight': case 'KeyD': moveRight.current = true; break;
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp': case 'KeyW': moveForward.current = false; break;
        case 'ArrowLeft': case 'KeyA': moveLeft.current = false; break;
        case 'ArrowDown': case 'KeyS': moveBackward.current = false; break;
        case 'ArrowRight': case 'KeyD': moveRight.current = false; break;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // タッチ視点操作
  useEffect(() => {
    const canvas = gl.domElement;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        cameraEuler.current.setFromQuaternion(camera.quaternion);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || isModalOpen) return;
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = touchX - touchStart.current.x;
      const deltaY = touchY - touchStart.current.y;
      const sensitivity = 0.005;

      cameraEuler.current.y -= deltaX * sensitivity;
      cameraEuler.current.x -= deltaY * sensitivity;
      cameraEuler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraEuler.current.x));
      camera.quaternion.setFromEuler(cameraEuler.current);
      touchStart.current = { x: touchX, y: touchY };
    };
    const onTouchEnd = () => { touchStart.current = null; };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [camera, gl, isModalOpen]);

  useFrame((state, delta) => {
    if (isModalOpen) return;

    // 減速 (摩擦)
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    // --- ★ 移動ロジックの修正 ---
    const joyX = joystickRef.current.x;
    const joyY = joystickRef.current.y;

    // 前後 (前=正)
    let moveZ = 0;
    if (moveForward.current) moveZ += 1;
    if (moveBackward.current) moveZ -= 1;
    if (joyY !== 0) moveZ += joyY;

    // 左右 (右=正) ※ここをシンプルにしました
    let moveX = 0;
    if (moveRight.current) moveX += 1;
    if (moveLeft.current) moveX -= 1;
    if (joyX !== 0) moveX += joyX; // ジョイスティックも右入力で正の値が来るなら足す

    // 加速
    // 速度 += 入力 * 加速度
    if (moveZ !== 0) velocity.current.z += moveZ * 40.0 * delta;
    if (moveX !== 0) velocity.current.x += moveX * 40.0 * delta;

    // 移動反映
    // translateX(正) = 右へ移動, translateZ(負) = 前へ移動 (Three.jsのカメラ座標系)
    camera.translateX(velocity.current.x * delta);
    camera.translateZ(-velocity.current.z * delta);
    
    camera.position.y = 1.7;
  });

  return null;
}

function CityBackground() {
  const buildings = useRef<any[]>([]);
  if (buildings.current.length === 0) {
    for (let i = 0; i < 150; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      if (Math.abs(x) < 5 && Math.abs(z) < 5) continue;
      const height = 5 + Math.random() * 20;
      buildings.current.push({ x, z, height });
    }
  }
  return (
    <group>
      {buildings.current.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, b.z]}>
          <boxGeometry args={[2, b.height, 2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.6} />
        </mesh>
      ))}
      <gridHelper args={[200, 50, '#555', '#222']} position={[0, 0.01, 0]} />
    </group>
  );
}

function SectionBuilding({ info, onSelect, isModalOpen }: { info: any, onSelect: any, isModalOpen: boolean }) {
  const [hovered, setHover] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.01;
  });

  return (
    <group position={[info.position[0], 0, info.position[2]]}>
      <mesh position={[0, 50, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 100, 8]} />
        <meshBasicMaterial color={info.color} transparent opacity={0.3} />
      </mesh>

      <mesh
        ref={meshRef}
        position={[0, info.height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(info.id);
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[3, info.height, 3]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : info.color} 
          emissive={info.color}
          emissiveIntensity={hovered ? 1.0 : 0.5}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {!isModalOpen && (
        <Html position={[0, info.height + 1.5, 0]} center distanceFactor={15} zIndexRange={[0, 50]}>
          <div 
            className={`px-4 py-2 rounded-lg font-bold text-sm pointer-events-none whitespace-nowrap border-2 transition-all duration-300 ${
              hovered 
                ? 'bg-white text-black border-white scale-110' 
                : 'bg-black/70 text-white border-white/30'
            }`}
          >
            {info.name}
          </div>
        </Html>
      )}
    </group>
  );
}

type SceneProps = {
  onSelectSection?: (sectionName: string) => void;
  isModalOpen: boolean;
  joystickRef: React.MutableRefObject<JoystickData>;
};

export default function Scene({ onSelectSection, isModalOpen, joystickRef }: SceneProps) {
  
  // ★ モーダルの開閉に合わせてマウスロックを確実に制御する
  useEffect(() => {
    if (isModalOpen) {
      document.exitPointerLock(); // 強制解除
    }
  }, [isModalOpen]);

  const handleSelect = (id: string) => {
    // 念のためここでも解除
    document.exitPointerLock();
    if (onSelectSection) onSelectSection(id);
  };

  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 1.7, 5]} fov={75} />
      
      <color attach="background" args={['#050505']} />
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Suspense fallback={null}>
        
        {/* モーダルが開いている間はPointerLockControlsを無効化 */}
        <PointerLockControls 
          selector="#canvas-container" 
          enabled={!isModalOpen} 
        />
        
        <Player joystickRef={joystickRef} isModalOpen={isModalOpen} />

        <CityBackground />
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.8} />
        </mesh>

        {SECTIONS.map((section) => (
          <SectionBuilding 
            key={section.id} 
            info={section} 
            onSelect={handleSelect} 
            isModalOpen={isModalOpen} 
          />
        ))}

      </Suspense>
    </Canvas>
  );
}