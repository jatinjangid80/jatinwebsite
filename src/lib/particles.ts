import * as THREE from 'three';

export const PARTICLE_COLORS = [
  '#4F46E5', // Blue
  '#7C3AED', // Purple
  '#06B6D4', // Cyan
  '#F59E0B', // Orange
  '#FACC15', // Yellow
];

export interface ParticleInitialData {
  x: number;
  y: number;
  z: number;
  color: THREE.Color;
  random: number;
}

/**
 * Generates initial spatial positions and characteristics for particles arranged in a soft radial field.
 */
export function generateParticlesData(count: number): ParticleInitialData[] {
  const data: ParticleInitialData[] = [];
  const colorObjects = PARTICLE_COLORS.map(c => new THREE.Color(c));

  for (let i = 0; i < count; i++) {
    // Radial distribution
    // Math.pow(Math.random(), 0.6) yields a higher concentration near the center (density distribution)
    const radius = Math.pow(Math.random(), 0.6) * 16;
    const angle = Math.random() * Math.PI * 2;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    // Layer particles mostly flat on Z axis with subtle organic depth
    const z = (Math.random() - 0.5) * 1.5;

    const color = colorObjects[Math.floor(Math.random() * colorObjects.length)];
    const random = Math.random();

    data.push({ x, y, z, color, random });
  }

  return data;
}
