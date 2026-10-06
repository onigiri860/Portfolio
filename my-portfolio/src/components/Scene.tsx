'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Billboard, Decal, Html, Sparkles, Text, useProgress } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// --- 型定義 ---
type JoystickData = { x: number; y: number };

// --- 惑星の設定 ---
const R = 12; // 惑星の半径
const WALK_SPEED = 5.5;
const DASH_SPEED = 10;
const JUMP_VELOCITY = 9;
const GRAVITY = 26;
const BUILDING_RADIUS = 1.7;
const NEAR_DISTANCE = 3.4;
const BALL_RADIUS = 0.45;

// 緯度・経度（度）から惑星表面の向き（単位ベクトル）を作る
function dirFromLatLon(lat: number, lon: number) {
  const la = THREE.MathUtils.degToRad(lat);
  const lo = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo));
}

// ローカルの +Y を n に、+Z を forward に向ける回転
function surfaceQuaternion(n: THREE.Vector3, forward: THREE.Vector3, out = new THREE.Quaternion()) {
  const z = forward.clone().sub(n.clone().multiplyScalar(forward.dot(n))).normalize();
  const x = new THREE.Vector3().crossVectors(n, z);
  return out.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, n, z));
}

// 適当な接線方向（ほぼ北向き）
function defaultForward(n: THREE.Vector3) {
  const ref = Math.abs(n.y) > 0.95 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);
  return ref.sub(n.clone().multiplyScalar(ref.dot(n))).normalize();
}

// 決まった並びの乱数（リロードしても配置が変わらないように）
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const SECTIONS = [
  { id: 'skills', name: 'SKILLS', lat: 28, lon: 0, color: '#0ea5e9', height: 2.6 },
  { id: 'works', name: 'WORKS', lat: -28, lon: 60, color: '#f59e0b', height: 3.4 },
  { id: 'experience', name: 'EXPERIENCE', lat: 28, lon: 120, color: '#10b981', height: 2.2 },
  { id: 'volleyball', name: 'VOLLEYBALL', lat: -28, lon: 180, color: '#f97316', height: 2 },
  { id: 'music', name: 'MUSIC', lat: 28, lon: 240, color: '#a855f7', height: 3 },
  { id: 'game', name: 'GAME', lat: -28, lon: 300, color: '#ef4444', height: 2.6 },
].map((s) => ({ ...s, dir: dirFromLatLon(s.lat, s.lon) }));

type Section = (typeof SECTIONS)[number];

const BIG_TREE_DIR = dirFromLatLon(90, 0);
const START_DIR = dirFromLatLon(50, 20);

// 惑星表面に物を置くためのグループ
function OnPlanet({ dir, lift = 0, yaw = 0, children }: { dir: THREE.Vector3; lift?: number; yaw?: number; children: React.ReactNode }) {
  const { position, quaternion } = useMemo(() => {
    const q = surfaceQuaternion(dir, defaultForward(dir));
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw));
    return { position: dir.clone().multiplyScalar(R + lift), quaternion: q };
  }, [dir, lift, yaw]);
  return (
    <group position={position} quaternion={quaternion}>
      {children}
    </group>
  );
}

// --- ローディング画面 ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl w-[300px]">
        <div className="mb-4 text-3xl animate-bounce">🪐</div>
        <h3 className="text-white font-bold text-lg mb-2 tracking-wider">Landing...</h3>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Html>
  );
}

// --- 色（パステル寄りで統一） ---
const PALETTE = {
  grass: ['#8ad66f', '#7ccb62', '#95dc7a', '#84d26b'],
  leaves: ['#4caf50', '#5cbf5a', '#3f9e4b', '#6fcf63'],
  pine: ['#2f8f5b', '#3aa36a', '#2a7f52'],
  blossom: ['#f9a8d4', '#fbcfe8', '#f472b6'],
  trunk: '#a0693b',
  rock: ['#cbd5e1', '#b6c2d1', '#d6dde6'],
  flower: ['#f472b6', '#fbbf24', '#c084fc', '#fb7185', '#ffffff', '#60a5fa'],
};

// --- 惑星本体（芝生の濃淡を頂点カラーで付ける） ---
function Planet() {
  const geometry = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(R, 24);
    const rand = seeded(7);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    const light = new THREE.Color('#9fe285');
    const dark = new THREE.Color('#6fbf58');
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize();
      // ゆるいまだら模様 + 少しのランダム
      const patch = Math.sin(v.x * 5.3) * Math.sin(v.y * 4.1 + 1) * Math.sin(v.z * 4.7 + 2);
      c.set(PALETTE.grass[0]).lerp(patch > 0 ? light : dark, Math.abs(patch) * 0.6 + rand() * 0.08);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      {/* 赤道をぐるっと回る一本道 */}
      <mesh receiveShadow>
        <cylinderGeometry args={[R + 0.04, R + 0.04, 1.6, 128, 1, true]} />
        <meshStandardMaterial color="#f1d5a0" roughness={1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// --- 木（丸い木 / とがった木 / 桜っぽい木） ---
type TreeKind = 'round' | 'pine' | 'blossom';

function Tree({ dir, scale = 1, yaw = 0, kind = 'round', tint = 0 }: { dir: THREE.Vector3; scale?: number; yaw?: number; kind?: TreeKind; tint?: number }) {
  const leaf = kind === 'blossom' ? PALETTE.blossom : PALETTE.leaves;
  return (
    <OnPlanet dir={dir} yaw={yaw} lift={-0.05}>
      <group scale={scale}>
        {kind === 'pine' ? (
          <>
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.16, 0.7, 6]} />
              <meshStandardMaterial color={PALETTE.trunk} flatShading />
            </mesh>
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[0, 0.85 + i * 0.55, 0]} rotation={[0, i * 0.5, 0]} castShadow>
                <coneGeometry args={[0.85 - i * 0.22, 0.95, 7]} />
                <meshStandardMaterial color={PALETTE.pine[(i + tint) % PALETTE.pine.length]} flatShading roughness={0.9} />
              </mesh>
            ))}
          </>
        ) : (
          <>
            <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0.05]} castShadow>
              <cylinderGeometry args={[0.1, 0.18, 1.2, 6]} />
              <meshStandardMaterial color={PALETTE.trunk} flatShading />
            </mesh>
            {[
              [0, 1.55, 0, 0.75],
              [0.45, 1.3, 0.15, 0.5],
              [-0.4, 1.35, -0.1, 0.52],
              [0.05, 1.95, -0.1, 0.45],
            ].map(([x, y, z, r], i) => (
              <mesh key={i} position={[x, y, z]} rotation={[i, i * 2, 0]} castShadow>
                <icosahedronGeometry args={[r, 1]} />
                <meshStandardMaterial color={leaf[(i + tint) % leaf.length]} flatShading roughness={0.85} />
              </mesh>
            ))}
          </>
        )}
      </group>
    </OnPlanet>
  );
}

function Bush({ dir, scale = 1, tint = 0 }: { dir: THREE.Vector3; scale?: number; tint?: number }) {
  return (
    <OnPlanet dir={dir} lift={-0.05}>
      <group scale={scale}>
        {[
          [0, 0.25, 0, 0.38],
          [0.32, 0.18, 0.05, 0.28],
          [-0.28, 0.2, -0.05, 0.3],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <icosahedronGeometry args={[r, 1]} />
            <meshStandardMaterial color={PALETTE.leaves[(i + tint) % PALETTE.leaves.length]} flatShading />
          </mesh>
        ))}
      </group>
    </OnPlanet>
  );
}

function Rock({ dir, scale = 1, yaw = 0, tint = 0 }: { dir: THREE.Vector3; scale?: number; yaw?: number; tint?: number }) {
  return (
    <OnPlanet dir={dir} yaw={yaw} lift={-0.08}>
      <mesh position={[0, 0.18 * scale, 0]} scale={[scale, scale * 0.7, scale * 0.9]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={PALETTE.rock[tint % PALETTE.rock.length]} flatShading roughness={0.9} />
      </mesh>
    </OnPlanet>
  );
}

// 惑星中にランダムに散らす（道と建物まわり、他のものの近くは避ける）
function scatter<T extends { dir: THREE.Vector3 }>(
  rand: () => number,
  blocked: THREE.Vector3[],
  count: number,
  minDot: number,
  spacing: number,
  make: (d: THREE.Vector3) => T
) {
  const out: T[] = [];
  let guard = 0;
  while (out.length < count && guard++ < 5000) {
    const d = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
    const free = Math.abs(d.y) > 0.09 && blocked.every((b) => b.dot(d) < minDot);
    if (free && out.every((o) => o.dir.dot(d) < spacing)) out.push(make(d));
  }
  return out;
}

// --- 木・茂み・岩・花 ---
function Nature() {
  const { trees, bushes, rocks, flowers } = useMemo(() => {
    const rand = seeded(860);
    const blocked = [...SECTIONS.map((s) => s.dir), BIG_TREE_DIR, START_DIR];
    const kinds: TreeKind[] = ['round', 'round', 'pine', 'pine', 'blossom'];
    const trees = scatter(rand, blocked, 30, 0.97, 0.985, (d) => ({
      dir: d,
      scale: 0.75 + rand() * 0.55,
      yaw: rand() * 6,
      kind: kinds[Math.floor(rand() * kinds.length)],
      tint: Math.floor(rand() * 4),
    }));
    const bushes = scatter(rand, blocked, 26, 0.985, 0.995, (d) => ({ dir: d, scale: 0.7 + rand() * 0.6, tint: Math.floor(rand() * 4) }));
    const rocks = scatter(rand, blocked, 16, 0.985, 0.995, (d) => ({ dir: d, scale: 0.6 + rand() * 0.9, yaw: rand() * 6, tint: Math.floor(rand() * 3) }));
    const flowers = scatter(rand, blocked, 110, 0.99, 1, (d) => ({ dir: d, color: PALETTE.flower[Math.floor(rand() * PALETTE.flower.length)] }));
    return { trees, bushes, rocks, flowers };
  }, []);

  return (
    <group>
      <Tree dir={BIG_TREE_DIR} scale={1.9} kind="round" />
      {trees.map((t, i) => (
        <Tree key={i} {...t} />
      ))}
      {bushes.map((b, i) => (
        <Bush key={i} {...b} />
      ))}
      {rocks.map((r, i) => (
        <Rock key={i} {...r} />
      ))}
      {flowers.map((f, i) => (
        <OnPlanet key={i} dir={f.dir}>
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.26, 4]} />
            <meshStandardMaterial color="#3f9e4b" />
          </mesh>
          <mesh position={[0, 0.29, 0]}>
            <icosahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial color={f.color} flatShading emissive={f.color} emissiveIntensity={0.15} />
          </mesh>
        </OnPlanet>
      ))}
    </group>
  );
}

// --- もこもこの雲（ゆっくり流れる） ---
function Cloud({ position, scale, rotation, seed }: { position: THREE.Vector3; scale: number; rotation: number; seed: number }) {
  const ref = useRef<THREE.Group>(null);
  const puffs = useMemo(() => {
    const rand = seeded(seed);
    const count = 4 + Math.floor(rand() * 3);
    return Array.from({ length: count }, (_, i) => {
      const x = (i - (count - 1) / 2) * 0.9 + (rand() - 0.5) * 0.3;
      const r = 0.7 + rand() * 0.5 + (1 - Math.abs(x) / count) * 0.5;
      return { x, y: r * 0.35 + rand() * 0.15, z: (rand() - 0.5) * 0.6, r };
    });
  }, [seed]);

  useFrame((state) => {
    if (ref.current) ref.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 0.4 + seed) * 0.4;
  });

  return (
    <group ref={ref} position={position} scale={scale} rotation={[0, rotation, 0]}>
      {puffs.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} scale={[1, 0.85, 0.9]}>
          <icosahedronGeometry args={[p.r, 2]} />
          <meshStandardMaterial color="#ffffff" emissive="#fff7ea" emissiveIntensity={0.45} flatShading roughness={1} />
        </mesh>
      ))}
      {/* 平らな底 */}
      <mesh position={[0, 0.05, 0]} scale={[puffs.length * 0.5, 0.18, 0.7]}>
        <sphereGeometry args={[1, 16, 8]} />
        <meshStandardMaterial color="#f8fbff" emissive="#eef4ff" emissiveIntensity={0.3} roughness={1} />
      </mesh>
    </group>
  );
}

function CloudSea() {
  const ref = useRef<THREE.Group>(null);
  const clouds = useMemo(() => {
    const rand = seeded(42);
    return Array.from({ length: 30 }, (_, i) => {
      const dir = new THREE.Vector3(rand() * 2 - 1, (rand() * 2 - 1) * 0.8, rand() * 2 - 1).normalize();
      return { position: dir.multiplyScalar(30 + rand() * 22), scale: 1.6 + rand() * 1.8, rotation: rand() * Math.PI, seed: i + 1 };
    });
  }, []);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.01;
  });

  return (
    <group ref={ref}>
      {clouds.map((c) => (
        <Cloud key={c.seed} {...c} />
      ))}
    </group>
  );
}

// --- セクションの建物 ---
function SectionBuilding({ info, isNear, onSelect }: { info: Section; isNear: boolean; onSelect: (id: string) => void }) {
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bodyRef.current) {
      const t = state.clock.elapsedTime + info.lon;
      bodyRef.current.position.y = Math.sin(t * 1.5) * 0.05;
      bodyRef.current.rotation.y += isNear ? 0.02 : 0.004;
    }
  });

  return (
    <OnPlanet dir={info.dir}>
      {/* 足元のリング（近づくと光る） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[BUILDING_RADIUS + 0.3, BUILDING_RADIUS + (isNear ? 0.75 : 0.5), 48]} />
        <meshBasicMaterial color={info.color} transparent opacity={isNear ? 0.9 : 0.35} />
      </mesh>

      <group
        ref={bodyRef}
        onClick={(e) => {
          // ドラッグで視点を回したときは開かない
          if (e.delta > 6) return;
          e.stopPropagation();
          onSelect(info.id);
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <mesh position={[0, info.height / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.4, info.height, 6]} />
          <meshStandardMaterial color="#fffaf0" roughness={0.6} />
        </mesh>
        <mesh position={[0, info.height + 0.55, 0]} castShadow>
          <coneGeometry args={[1.6, 1.3, 6]} />
          <meshStandardMaterial color={info.color} emissive={info.color} emissiveIntensity={isNear ? 0.6 : 0.15} roughness={0.4} />
        </mesh>
        <mesh position={[0, info.height * 0.55, 1.13]}>
          <boxGeometry args={[0.7, 0.7, 0.1]} />
          <meshStandardMaterial color={info.color} emissive={info.color} emissiveIntensity={0.4} />
        </mesh>
      </group>

      <Billboard position={[0, info.height + 2, 0]}>
        <Text fontSize={isNear ? 0.85 : 0.7} color={info.color} anchorX="center" anchorY="middle" outlineWidth={0.06} outlineColor="#ffffff">
          {info.name}
        </Text>
      </Billboard>
    </OnPlanet>
  );
}

// --- おにぎりのキャラクター（+Z が前） ---
// ぬいぐるみのように、丸い三角の白い体・黒い海苔・小さな目・短い手足
function useOnigiriGeometry() {
  return useMemo(() => {
    const g = new THREE.SphereGeometry(0.62, 48, 36);
    const pos = g.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const t = (v.y / 0.62 + 1) / 2; // 0 = 下, 1 = 上
      // 上ほど細くして三角に、奥行きは薄めに
      const width = 1.18 - 0.5 * t * t;
      v.x *= width;
      v.z *= 0.78 * (1.05 - 0.2 * t);
      // 底を少し平らに
      if (v.y < -0.42) v.y = -0.42 + (v.y + 0.42) * 0.35;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }, []);
}

function Character({ rigRef }: { rigRef: React.MutableRefObject<CharacterRig | null> }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const bodyGeometry = useOnigiriGeometry();

  useEffect(() => {
    rigRef.current = { root: root.current!, body: body.current!, armL: armL.current!, armR: armR.current!, legL: legL.current!, legR: legR.current! };
  }, [rigRef]);

  // ふわふわのぬいぐるみっぽい質感
  const fluff = <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.18} roughness={1} sheen={1} sheenColor="#ffffff" sheenRoughness={0.6} />;

  return (
    <group ref={root}>
      <group ref={body}>
        <mesh geometry={bodyGeometry} position={[0, 0.78, 0]} castShadow receiveShadow>
          {fluff}
          {/* 海苔（体の表面に貼り付ける） */}
          <Decal position={[0, -0.24, 0.45]} rotation={[0, 0, 0]} scale={[0.5, 0.64, 0.6]}>
            <meshStandardMaterial color="#141414" roughness={0.9} polygonOffset polygonOffsetFactor={-4} />
          </Decal>
        </mesh>
        {/* 目 */}
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 1.04, 0.39]} scale={[1, 1.15, 0.6]}>
            <sphereGeometry args={[0.04, 12, 10]} />
            <meshStandardMaterial color="#111111" roughness={0.3} />
          </mesh>
        ))}
        {/* 腕（体の横から生えた短い手） */}
        {([
          [armL, -1],
          [armR, 1],
        ] as const).map(([ref, s]) => (
          <group key={s} ref={ref} position={[s * 0.6, 0.62, 0.02]}>
            <mesh position={[s * 0.1, -0.08, 0]} scale={[0.85, 1.15, 0.85]} castShadow>
              <sphereGeometry args={[0.16, 16, 12]} />
              {fluff}
            </mesh>
          </group>
        ))}
      </group>
      {/* 足（前に出た丸い足） */}
      {([
        [legL, -1],
        [legR, 1],
      ] as const).map(([ref, s]) => (
        <group key={s} ref={ref} position={[s * 0.24, 0.3, 0.12]}>
          <mesh position={[0, -0.12, 0.08]} scale={[1, 0.8, 1.25]} castShadow>
            <sphereGeometry args={[0.17, 16, 12]} />
            {fluff}
          </mesh>
        </group>
      ))}
    </group>
  );
}

type CharacterRig = {
  root: THREE.Group;
  body: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
};

// --- 操作・物理・カメラをまとめて動かす ---
function World({
  joystickRef,
  jumpRef,
  isModalOpen,
  onSelect,
  onNearChange,
}: {
  joystickRef: React.MutableRefObject<JoystickData>;
  jumpRef: React.MutableRefObject<boolean>;
  isModalOpen: boolean;
  onSelect: (id: string) => void;
  onNearChange: (id: string | null) => void;
}) {
  const { camera, gl } = useThree();
  const rig = useRef<CharacterRig | null>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  const keys = useRef<Record<string, boolean>>({});
  const nearRef = useRef<string | null>(null);

  // プレイヤーの状態（惑星表面の向き・高さ・向いている方向・カメラの向き）
  const player = useRef({
    dir: START_DIR.clone(),
    height: 0,
    vh: 0,
    facing: defaultForward(START_DIR).negate(),
    camFwd: defaultForward(START_DIR).negate(),
    speed: 0,
    phase: 0,
  });
  const view = useRef({ dist: 8.5, pitch: 0.45 });
  const ball = useRef({
    dir: dirFromLatLon(-28, 150),
    vel: new THREE.Vector3(),
    rot: new THREE.Quaternion(),
  });

  // 近くの建物が変わったら親に知らせる
  const setNear = (id: string | null) => {
    if (nearRef.current !== id) {
      nearRef.current = id;
      onNearChange(id);
    }
  };

  // キーボード
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'Space') e.preventDefault();
      if (e.code === 'KeyE' && nearRef.current && !isModalOpen) onSelect(nearRef.current);
    };
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [isModalOpen, onSelect]);

  // ドラッグで視点を回す・ホイールでズーム
  useEffect(() => {
    const el = gl.domElement;
    let last: { x: number; y: number } | null = null;
    const start = (x: number, y: number) => (last = { x, y });
    const move = (x: number, y: number) => {
      if (!last || isModalOpen) return;
      const p = player.current;
      const n = p.dir;
      p.camFwd.applyAxisAngle(n, -(x - last.x) * 0.006);
      view.current.pitch = THREE.MathUtils.clamp(view.current.pitch + (y - last.y) * 0.004, 0.08, 1.2);
      last = { x, y };
    };
    const end = () => (last = null);

    const onMouseDown = (e: MouseEvent) => start(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => start(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      move(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      view.current.dist = THREE.MathUtils.clamp(view.current.dist + e.deltaY * 0.01, 4, 16);
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', end);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', end);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', end);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', end);
      el.removeEventListener('wheel', onWheel);
    };
  }, [gl, isModalOpen]);

  // 作業用ベクトル
  const tmp = useMemo(
    () => ({
      right: new THREE.Vector3(),
      move: new THREE.Vector3(),
      axis: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      v: new THREE.Vector3(),
      camPos: new THREE.Vector3(),
      target: new THREE.Vector3(),
    }),
    []
  );

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const p = player.current;
    const n = p.dir;
    const k = keys.current;

    // カメラの前方向を接平面に戻す（誤差の蓄積を防ぐ）
    p.camFwd.sub(tmp.v.copy(n).multiplyScalar(p.camFwd.dot(n))).normalize();
    tmp.right.crossVectors(p.camFwd, n);

    // 入力（カメラ基準）
    let ix = 0;
    let iy = 0;
    if (!isModalOpen) {
      if (k.KeyW || k.ArrowUp) iy += 1;
      if (k.KeyS || k.ArrowDown) iy -= 1;
      if (k.KeyD || k.ArrowRight) ix += 1;
      if (k.KeyA || k.ArrowLeft) ix -= 1;
      ix += joystickRef.current.x;
      iy += joystickRef.current.y;
    }
    tmp.move.copy(p.camFwd).multiplyScalar(iy).addScaledVector(tmp.right, ix);
    const amount = Math.min(tmp.move.length(), 1);
    const dash = k.ShiftLeft || k.ShiftRight;
    const targetSpeed = amount * (dash ? DASH_SPEED : WALK_SPEED);
    p.speed = THREE.MathUtils.damp(p.speed, targetSpeed, 10, dt);

    // 惑星の表面に沿って移動（中心まわりの回転として扱う）
    if (amount > 0.01) {
      tmp.move.normalize();
      // 進む方向を向く
      p.facing.lerp(tmp.move, 1 - Math.exp(-12 * dt)).normalize();
    }
    if (p.speed > 0.01) {
      tmp.axis.crossVectors(n, p.facing).normalize();
      tmp.q.setFromAxisAngle(tmp.axis, (p.speed * dt) / (R + p.height));
      n.applyQuaternion(tmp.q).normalize();
      p.camFwd.applyQuaternion(tmp.q);
      p.facing.applyQuaternion(tmp.q);
    }
    p.facing.sub(tmp.v.copy(n).multiplyScalar(p.facing.dot(n))).normalize();

    // ジャンプと重力
    if (!isModalOpen && (k.Space || jumpRef.current) && p.height <= 0) p.vh = JUMP_VELOCITY;
    jumpRef.current = false;
    p.vh -= GRAVITY * dt;
    p.height = Math.max(0, p.height + p.vh * dt);
    if (p.height === 0) p.vh = Math.max(0, p.vh);

    // 建物とぶつからないように押し戻す & 近くの建物を探す
    let near: string | null = null;
    for (const s of SECTIONS) {
      const dist = Math.acos(THREE.MathUtils.clamp(n.dot(s.dir), -1, 1)) * R;
      if (dist < NEAR_DISTANCE) near = s.id;
      if (dist < BUILDING_RADIUS && p.height < s.height + 1) {
        tmp.v.copy(n).sub(tmp.axis.copy(s.dir).multiplyScalar(n.dot(s.dir)));
        if (tmp.v.lengthSq() < 1e-8) tmp.v.copy(defaultForward(s.dir));
        tmp.v.normalize();
        const a = BUILDING_RADIUS / R;
        n.copy(s.dir).multiplyScalar(Math.cos(a)).addScaledVector(tmp.v, Math.sin(a)).normalize();
      }
    }
    // てっぺんの大きな木の幹にはぶつかる
    const treeDist = Math.acos(THREE.MathUtils.clamp(n.dot(BIG_TREE_DIR), -1, 1)) * R;
    if (treeDist < 0.6) {
      tmp.v.copy(n).sub(tmp.axis.copy(BIG_TREE_DIR).multiplyScalar(n.dot(BIG_TREE_DIR)));
      if (tmp.v.lengthSq() < 1e-8) tmp.v.copy(defaultForward(BIG_TREE_DIR));
      tmp.v.normalize();
      const a = 0.6 / R;
      n.copy(BIG_TREE_DIR).multiplyScalar(Math.cos(a)).addScaledVector(tmp.v, Math.sin(a)).normalize();
    }
    setNear(isModalOpen ? null : near);

    // キャラクターの見た目
    const r = rig.current;
    if (r) {
      r.root.position.copy(n).multiplyScalar(R + p.height);
      surfaceQuaternion(n, p.facing, r.root.quaternion);
      const moving = Math.min(p.speed / WALK_SPEED, 1.4);
      p.phase += dt * (6 + p.speed * 1.4);
      const swing = Math.sin(p.phase) * 0.7 * moving;
      const air = p.height > 0;
      r.legL.rotation.x = air ? -0.5 : swing;
      r.legR.rotation.x = air ? -0.5 : -swing;
      // 手は横にパタパタ、ジャンプ中はバンザイ
      const flap = Math.abs(Math.sin(p.phase)) * 0.5 * moving;
      r.armL.rotation.z = air ? -1.3 : -0.15 - flap;
      r.armR.rotation.z = air ? 1.3 : 0.15 + flap;
      r.armL.rotation.x = air ? 0 : -swing * 0.5;
      r.armR.rotation.x = air ? 0 : swing * 0.5;
      // 体を左右に揺らしながら弾む（ぬいぐるみっぽく少しつぶれる）
      const bounce = Math.abs(Math.sin(p.phase));
      r.body.position.y = air ? 0.05 : bounce * 0.1 * moving;
      r.body.rotation.z = air ? 0 : Math.sin(p.phase) * 0.12 * moving;
      r.body.rotation.x = 0.12 * moving;
      const squash = air ? 1.06 : 1 - (1 - bounce) * 0.06 * moving;
      r.body.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
    }

    // ボール（ぶつかると転がる）
    const b = ball.current;
    const ballDist = Math.acos(THREE.MathUtils.clamp(n.dot(b.dir), -1, 1)) * R;
    if (ballDist < 0.95 && p.height < 1) {
      tmp.v.copy(b.dir).sub(tmp.axis.copy(n).multiplyScalar(b.dir.dot(n)));
      if (tmp.v.lengthSq() > 1e-8) b.vel.copy(tmp.v.normalize()).multiplyScalar(p.speed * 1.6 + 3);
    }
    b.vel.multiplyScalar(Math.exp(-0.9 * dt));
    const bs = b.vel.length();
    if (bs > 0.02) {
      tmp.axis.crossVectors(b.dir, b.vel).normalize();
      const dist = bs * dt;
      tmp.q.setFromAxisAngle(tmp.axis, dist / R);
      b.dir.applyQuaternion(tmp.q).normalize();
      b.vel.applyQuaternion(tmp.q);
      b.vel.sub(tmp.v.copy(b.dir).multiplyScalar(b.vel.dot(b.dir)));
      b.rot.premultiply(tmp.q.setFromAxisAngle(tmp.axis, dist / BALL_RADIUS));
    }
    if (ballRef.current) {
      ballRef.current.position.copy(b.dir).multiplyScalar(R + BALL_RADIUS);
      ballRef.current.quaternion.copy(b.rot);
    }

    // カメラ（キャラクターの後ろ上から追いかける）
    const { dist, pitch } = view.current;
    tmp.target.copy(n).multiplyScalar(R + p.height + 1.1);
    tmp.camPos
      .copy(n)
      .multiplyScalar(R + p.height + 1.1 + Math.sin(pitch) * dist)
      .addScaledVector(p.camFwd, -Math.cos(pitch) * dist);
    const follow = 1 - Math.exp(-6 * dt);
    camera.position.lerp(tmp.camPos, follow);
    camera.up.lerp(n, follow).normalize();
    camera.lookAt(tmp.target);
  });

  return (
    <>
      <Character rigRef={rig} />
      <mesh ref={ballRef} castShadow>
        <sphereGeometry args={[BALL_RADIUS, 24, 18]} />
        <meshStandardMaterial color="#fde047" roughness={0.5} />
      </mesh>
    </>
  );
}

// --- メインシーン ---
export default function Scene({
  onSelectSection,
  onNearSection,
  nearSection,
  isModalOpen,
  joystickRef,
  jumpRef,
}: {
  onSelectSection?: (id: string) => void;
  onNearSection?: (id: string | null) => void;
  nearSection?: string | null;
  isModalOpen: boolean;
  joystickRef: React.MutableRefObject<JoystickData>;
  jumpRef: React.MutableRefObject<boolean>;
}) {
  const handleSelect = (id: string) => onSelectSection?.(id);

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 60, near: 0.1, far: 300, position: [10, R + 25, 45] }}>
      <color attach="background" args={['#bfe3ff']} />
      <hemisphereLight args={['#ffffff', '#ffe7b0', 1.1]} />
      <directionalLight
        position={[20, 30, 15]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-far={80}
      />

      <CloudSea />
      <Sparkles count={300} scale={60} size={3} speed={0.3} opacity={0.5} color="#fbbf24" />

      <Suspense fallback={<Loader />}>
        <Planet />
        <Nature />
        {SECTIONS.map((s) => (
          <SectionBuilding key={s.id} info={s} isNear={nearSection === s.id} onSelect={handleSelect} />
        ))}
        <World
          joystickRef={joystickRef}
          jumpRef={jumpRef}
          isModalOpen={isModalOpen}
          onSelect={handleSelect}
          onNearChange={(id) => onNearSection?.(id)}
        />
      </Suspense>
    </Canvas>
  );
}
