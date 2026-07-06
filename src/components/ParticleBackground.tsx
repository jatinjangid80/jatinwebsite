"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '../hooks/useMousePosition';
import { solveSpring3D, SpringConfig } from '../utils/physics';
import { generateParticlesData } from '../lib/particles';

// Import shaders as raw strings (supported via webpack rule in next.config.ts)
import vertexShader from '../shaders/particle.vert';
import fragmentShader from '../shaders/particle.frag';

const PARTICLE_COUNT = 10000;

// Configurable Spring Physics Constants (attraction, damping, mass)
const SPRING_CONFIG: SpringConfig = {
  stiffness: 12.0, // Magnetic pull strength
  damping: 0.55,    // Damping resistance to prevent wild oscillations
  mass: 1.0,        // Acceleration resistance
};

const INTERACTION_RADIUS = 5.0; // Distance in 3D units where mouse attracts particles

interface ParticlesProps {
  mouseRef: ReturnType<typeof useMousePosition>;
  activeColorHex: string;
}

const Particles: React.FC<ParticlesProps> = ({ mouseRef, activeColorHex }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate initial particle grid/field data once
  const initialData = useMemo(() => generateParticlesData(PARTICLE_COUNT), []);

  // Track dynamic positions and velocities of all particles on the CPU
  const state = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const origins = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const randoms = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const layers = new Int8Array(PARTICLE_COUNT);

    initialData.forEach((p, i) => {
      // Set current positions same as origins initially
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;

      origins[i * 3] = p.x;
      origins[i * 3 + 1] = p.y;
      origins[i * 3 + 2] = p.z;

      // Velocities start at 0
      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;

      // Color data
      colors[i * 3] = p.color.r;
      colors[i * 3 + 1] = p.color.g;
      colors[i * 3 + 2] = p.color.b;

      // Custom random factor for offset wave in shaders
      randoms[i] = p.random;

      // Calculate layer and size internally if not provided by particles.ts
      let layer = (p as any).layer;
      let size = (p as any).size;

      if (layer === undefined || size === undefined) {
        const layerRandom = Math.random();
        if (layerRandom < 0.4) {
          layer = 0; // Back layer
          size = 0.04 + Math.random() * 0.03;
        } else if (layerRandom > 0.8) {
          layer = 2; // Front layer
          size = 0.15 + Math.random() * 0.08;
        } else {
          layer = 1; // Middle layer
          size = 0.08 + Math.random() * 0.04;
        }
      }
      
      sizes[i] = size;
      layers[i] = layer;
    });

    return { positions, velocities, origins, colors, randoms, sizes, layers };
  }, [initialData]);

  // Set up Shader Material uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uActiveColor: { value: new THREE.Color(activeColorHex) },
    uMouse3D: { value: new THREE.Vector3(-1000, -1000, 0) },
  }), []);

  // Set initial instance matrices on mount
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dummy.position.set(state.origins[i * 3], state.origins[i * 3 + 1], state.origins[i * 3 + 2]);
      // Small scale of particles
      dummy.scale.set(0.12, 0.12, 0.12);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [state]);

  // Main high-performance frame loop (60 FPS)
  useFrame((threeState, delta) => {
    // 1. Cap delta to avoid physics explosion on low frame rates or tab backgrounding
    const dt = Math.min(delta, 0.05);

    // 3. Project mouse normalized screen coords to 3D Viewport units
    const mousePos = mouseRef.current;
    let mouse3D: THREE.Vector3 | null = null;
    if (mousePos.ndcX !== -1000) {
      mouse3D = new THREE.Vector3(
        (mousePos.ndcX * threeState.viewport.width) / 2,
        (mousePos.ndcY * threeState.viewport.height) / 2,
        0
      );
    }

    // 2. Update shader uniforms (slow wave float timing & colors)
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = threeState.clock.getElapsedTime();
      materialRef.current.uniforms.uActiveColor.value.set(activeColorHex);
      if (mouse3D) {
        materialRef.current.uniforms.uMouse3D.value.copy(mouse3D);
      } else {
        materialRef.current.uniforms.uMouse3D.value.set(-1000, -1000, 0);
      }
    }

    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    const tempPos = new THREE.Vector3();
    const tempTarget = new THREE.Vector3();
    const tempVel = new THREE.Vector3();

    // 4. Update spring physics for each particle and compile matrices
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      // Load current position and velocity vectors
      tempPos.set(state.positions[idx], state.positions[idx + 1], state.positions[idx + 2]);
      tempVel.set(state.velocities[idx], state.velocities[idx + 1], state.velocities[idx + 2]);

      // Default target is original particle grid coordinate
      tempTarget.set(state.origins[idx], state.origins[idx + 1], state.origins[idx + 2]);

      // Calculate magnetic mouse repulsion (push particles away from cursor)
      if (mouse3D) {
        // Vector pointing from mouse to particle
        const dx = tempPos.x - mouse3D.x;
        const dy = tempPos.y - mouse3D.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INTERACTION_RADIUS) {
          // Calculate force intensity (strongest when very close)
          const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;

          // Direction of push
          const angle = Math.atan2(dy, dx);

          // Repel target: push coordinate away from cursor based on proximity
          const pushDistance = (INTERACTION_RADIUS - dist) * 1.5;
          tempTarget.set(
            state.origins[idx] + Math.cos(angle) * pushDistance,
            state.origins[idx + 1] + Math.sin(angle) * pushDistance,
            state.origins[idx + 2]
          );
        }
      }

      // Step spring physics
      const physicsResult = solveSpring3D(
        [tempPos.x, tempPos.y, tempPos.z],
        [tempTarget.x, tempTarget.y, tempTarget.z],
        [tempVel.x, tempVel.y, tempVel.z],
        SPRING_CONFIG,
        dt
      );

      // Write results back to arrays
      state.positions[idx] = physicsResult.position[0];
      state.positions[idx + 1] = physicsResult.position[1];
      state.positions[idx + 2] = physicsResult.position[2];

      state.velocities[idx] = physicsResult.velocity[0];
      state.velocities[idx + 1] = physicsResult.velocity[1];
      state.velocities[idx + 2] = physicsResult.velocity[2];

      // 5. Apply new position to Instance Matrix
      dummy.position.set(physicsResult.position[0], physicsResult.position[1], physicsResult.position[2]);
      dummy.scale.set(0.12, 0.12, 0.12);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    // Flag changes to GPU
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, PARTICLE_COUNT]}>
      {/* Geometry: simple plane representing a 2D quad billboard */}
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute
          attach="attributes-aColor"
          args={[state.colors, 3]}
        />
        <instancedBufferAttribute
          attach="attributes-aRandom"
          args={[state.randoms, 1]}
        />
      </planeGeometry>

      {/* GLSL Material */}
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};

interface ParticleBackgroundProps {
  activeColorHex: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ activeColorHex }) => {
  const mouseRef = useMousePosition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[var(--bg)] transition-colors duration-300">
      {/* Soft gradient backing overlay */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, var(--accent-soft) 0%, transparent 100%)',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} // Cap pixel ratio to 2 for performance
      >
        <Particles mouseRef={mouseRef} activeColorHex={activeColorHex} />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;
