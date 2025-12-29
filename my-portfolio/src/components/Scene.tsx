'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  Html, 
  PointerLockControls, 
  PerspectiveCamera,
  Sky,
  useProgress,
  Text,
  Float,
  Sparkles // ★追加: キラキラエフェクト
} from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// --- 型定義 ---
type JoystickData = { x: number; y: number };

// --- 設定データ ---
const SECTIONS = [
  { id: 'skills', name: 'SKILLS', position: [-8, 0, -8], color: '#0ea5e9', height: 4 },
  { id: 'works', name: 'WORKS', position: [8, 0, -8], color: '#f59e0b', height: 6 },
  { id: 'experience', name: 'EXPERIENCE', position: [-8, 0, 8], color: '#10b981', height: 3 },
  { id: 'volleyball', name: 'VOLLEYBALL', position: [8, 0, 8], color: '#f97316', height: 2 },
  { id: 'music', name: 'MUSIC', position: [-15, 0, 0], color: '#a855f7', height: 5 },
  { id: 'game', name: 'GAME', position: [15, 0, 0], color: '#ef4444', height: 4 },
];

// --- ローディング画面 ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl w-[300px]">
        <div className="mb-4 text-emerald-400 text-3xl animate-bounce">🌳</div>
        <h3 className="text-white font-bold text-lg mb-2 tracking-wider">Building Park...</h3>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-right w-full text-xs text-emerald-300 mt-2 font-mono">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

// --- プレイヤー制御 ---
function Player({ joystickRef, isModalOpen }: { joystickRef: React.MutableRefObject<JoystickData>, isModalOpen: boolean }) {
  const { camera, gl } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = useRef(new THREE.Vector3());
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
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;
    const joyX = joystickRef.current.x;
    const joyY = joystickRef.current.y;
    let moveZ = 0; if (moveForward.current) moveZ += 1; if (moveBackward.current) moveZ -= 1; if (joyY !== 0) moveZ += joyY;
    let moveX = 0; if (moveRight.current) moveX += 1; if (moveLeft.current) moveX -= 1; if (joyX !== 0) moveX += joyX;
    if (moveZ !== 0) velocity.current.z += moveZ * 40.0 * delta;
    if (moveX !== 0) velocity.current.x += moveX * 40.0 * delta;
    camera.translateX(velocity.current.x * delta);
    camera.translateZ(-velocity.current.z * delta);
    camera.position.y = 1.7;
  });

  return null;
}

// --- デフォルメされた雲 ---
function SimpleCloud({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[1.8, -0.4, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-1.8, -0.2, 0]}>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// --- 木 ---
function Tree({ position }: { position: [number, number, number] }) {
  const scale = useMemo(() => 0.8 + Math.random() * 0.4, []);
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.4, 2]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 2.5, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.2, 2, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.8} />
      </mesh>
    </group>
  );
}

// --- 花 (彩りを添える) ---
function Flower({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <group position={position}>
      {/* 茎 */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="green" />
      </mesh>
      {/* 花弁 */}
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.1, 0.2, 5]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Nature() {
  // 木の配置
  const trees = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 30; 
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      temp.push([x, 0, z] as [number, number, number]);
    }
    return temp;
  }, []);

  // 花の配置
  const flowers = useMemo(() => {
    const temp = [];
    const colors = ['#f472b6', '#fbbf24', '#c084fc', '#f87171']; // ピンク、黄色、紫、赤
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 40; 
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      temp.push({ 
        pos: [x, 0, z] as [number, number, number], 
        color: colors[Math.floor(Math.random() * colors.length)] 
      });
    }
    return temp;
  }, []);

  return (
    <group>
      {trees.map((pos, i) => <Tree key={`tree-${i}`} position={pos} />)}
      {flowers.map((f, i) => <Flower key={`flower-${i}`} position={f.pos} color={f.color} />)}
    </group>
  );
}

// --- 道 (Pathways) ---
function Pathways() {
  return (
    <group position={[0, 0.01, 0]}>
      {/* X字や十字に道を敷く */}
      {/* 縦の道 */}
      <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 60]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
      </mesh>
      {/* 横の道 */}
      <mesh rotation={[-Math.PI/2, 0, Math.PI/2]} receiveShadow>
        <planeGeometry args={[4, 60]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
      </mesh>
      {/* 中央の広場 */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.9} />
      </mesh>
    </group>
  );
}

// --- バレーボール ---
function InteractiveBall({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [velocity, setVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  const handleJump = () => {
    if (!isJumping) {
      setVelocity(0.8);
      setIsJumping(true);
    }
  };

  useFrame(() => {
    if (!mesh.current) return;
    if (isJumping) {
      mesh.current.position.y += velocity;
      setVelocity((v) => v - 0.05);
      if (mesh.current.position.y <= 0.5) {
        if (velocity < -0.2) {
            mesh.current.position.y = 0.5;
            setVelocity((v) => -v * 0.6);
        } else {
            mesh.current.position.y = 0.5;
            setIsJumping(false);
            setVelocity(0);
        }
      }
      mesh.current.rotation.x += velocity;
    }
  });

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.02, 0]}>
         <circleGeometry args={[0.4, 32]} />
         <meshBasicMaterial color="black" opacity={0.3} transparent />
      </mesh>
      <mesh 
        ref={mesh} 
        position={[0, 0.5, 0]} 
        onClick={(e) => { e.stopPropagation(); handleJump(); }}
        castShadow
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
}

// --- メインのセクション建物 ---
function SectionBuilding({ info, onSelect, isModalOpen }: { info: any, onSelect: any, isModalOpen: boolean }) {
  const [hovered, setHover] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = (info.height / 2) + Math.sin(state.clock.elapsedTime + info.position[0]) * 0.1;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={[info.position[0], 0, info.position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshBasicMaterial color="#000000" opacity={0.2} transparent />
      </mesh>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, info.height + 2, 0]}>
        <Text
          fontSize={1.5}
          color={info.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#ffffff"
        >
          {info.name}
        </Text>
      </Float>

      <mesh
        ref={meshRef}
        position={[0, info.height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(info.id);
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        castShadow
      >
        <boxGeometry args={[3, info.height, 3]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : info.color} 
          emissive={info.color}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

// --- 地面 ---
function ParkGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#86efac" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

// --- メインシーン ---
export default function Scene({ onSelectSection, isModalOpen, joystickRef }: { onSelectSection?: (id: string) => void, isModalOpen: boolean, joystickRef: any }) {
  
  useEffect(() => {
    if (isModalOpen) document.exitPointerLock();
  }, [isModalOpen]);

  const handleSelect = (id: string) => {
    document.exitPointerLock();
    if (onSelectSection) onSelectSection(id);
  };

  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 1.7, 12]} fov={75} />
      
      <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />
      <Environment preset="park" />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
      <ambientLight intensity={0.6} />
      
      {/* 雲 */}
      <SimpleCloud position={[0, 15, -20]} scale={2} />
      <SimpleCloud position={[-25, 12, -10]} scale={1.5} />
      <SimpleCloud position={[25, 18, -15]} scale={1.8} />
      <SimpleCloud position={[10, 20, 10]} scale={1.2} />

      {/* ★キラキラエフェクト (Sparkles) */}
      <Sparkles 
        count={500} 
        scale={40} 
        size={4} 
        speed={0.4} 
        opacity={0.6} 
        color="#fbbf24" // 金色の光
        position={[0, 5, 0]}
      />

      <Suspense fallback={<Loader />}>
        <PointerLockControls selector="#canvas-container" enabled={!isModalOpen} />
        <Player joystickRef={joystickRef} isModalOpen={isModalOpen} />
        
        {/* 地面と道 */}
        <ParkGround />
        <Pathways />

        {/* 自然 (木と花) */}
        <Nature />

        {SECTIONS.map((section) => (
          <SectionBuilding 
            key={section.id} 
            info={section} 
            onSelect={handleSelect} 
            isModalOpen={isModalOpen} 
          />
        ))}

        <InteractiveBall position={[11, 0, 11]} />

      </Suspense>
    </Canvas>
  );
}