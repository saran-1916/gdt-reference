"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { SceneType } from "@/lib/gdt-data";

type ToleranceSceneProps = {
  type: SceneType;
};

function PositionModel() {
  return (
    <group rotation={[0.28, -0.48, 0]}>
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[3.4, 0.18, 2.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 1.8, 48, 1, true]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.32} />
      </mesh>
      <mesh position={[0.2, 0.18, -0.12]} rotation={[0.12, 0.02, 0.08]}>
        <cylinderGeometry args={[0.12, 0.12, 2.1, 32]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.4, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

function FlatnessModel() {
  return (
    <group rotation={[0.38, -0.42, 0]}>
      <mesh position={[0, -0.34, 0]}>
        <boxGeometry args={[3.4, 0.08, 2]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.38} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[3.4, 0.08, 2]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.38} />
      </mesh>
      <mesh position={[0, -0.17, 0]}>
        <boxGeometry args={[3, 0.18, 1.65]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.65} />
      </mesh>
      <mesh position={[-0.45, -0.02, -0.2]}>
        <sphereGeometry args={[0.08, 24, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0.42, -0.3, 0.28]}>
        <sphereGeometry args={[0.08, 24, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[1.05, -0.08, -0.45]}>
        <sphereGeometry args={[0.08, 24, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

function SymmetryModel() {
  return (
    <group rotation={[0.18, -0.55, 0]}>
      <mesh>
        <boxGeometry args={[3.2, 1.4, 1.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.72, 1.55, 2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.04, 1.9, 2.35]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[-0.18, 0, 0]}>
        <boxGeometry args={[0.04, 1.85, 2.25]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.45} />
      </mesh>
      <mesh position={[0.18, 0, 0]}>
        <boxGeometry args={[0.04, 1.85, 2.25]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.45} />
      </mesh>
      {[-0.45, 0, 0.45].map((z, index) => (
        <mesh key={z} position={[index === 1 ? 0.06 : -0.04, 0.78, z]}>
          <sphereGeometry args={[0.07, 24, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      ))}
    </group>
  );
}

export function ToleranceScene({ type }: ToleranceSceneProps) {
  const modelType =
    type === "position" || type === "runout" || type === "concentricity" || type === "material"
      ? "position"
      : type === "symmetry" || type === "datum" || type === "orientation" || type === "profile"
        ? "symmetry"
        : "flatness";

  return (
    <div className="h-[320px] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
      <Canvas camera={{ position: [3.5, 2.4, 4], fov: 42 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        {modelType === "position" ? <PositionModel /> : null}
        {modelType === "flatness" ? <FlatnessModel /> : null}
        {modelType === "symmetry" ? <SymmetryModel /> : null}
        <OrbitControls enablePan={false} minDistance={3} maxDistance={7} />
      </Canvas>
    </div>
  );
}
