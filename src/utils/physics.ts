export interface SpringConfig {
  stiffness: number; // Spring stiffness constant (k)
  damping: number;   // Friction / resistance constant (c)
  mass: number;      // Particle mass (m)
}

/**
 * Calculates the next position and velocity of a particle coordinate using Spring Physics.
 * F = -k * x - c * v
 * a = F / m
 */
export const solveSpring1D = (
  current: number,
  target: number,
  velocity: number,
  config: SpringConfig,
  dt: number
): { position: number; velocity: number } => {
  // Spring force: -k * (x - target)
  const displacement = current - target;
  const springForce = -config.stiffness * displacement;
  
  // Damping force: -c * v
  const dampingForce = -config.damping * velocity;
  
  const totalForce = springForce + dampingForce;
  const acceleration = totalForce / config.mass;
  
  const nextVelocity = velocity + acceleration * dt;
  const nextPosition = current + nextVelocity * dt;
  
  return { position: nextPosition, velocity: nextVelocity };
};

/**
 * Solve spring physics for 3D coordinates.
 */
export const solveSpring3D = (
  current: [number, number, number],
  target: [number, number, number],
  velocity: [number, number, number],
  config: SpringConfig,
  dt: number
): { position: [number, number, number]; velocity: [number, number, number] } => {
  const x = solveSpring1D(current[0], target[0], velocity[0], config, dt);
  const y = solveSpring1D(current[1], target[1], velocity[1], config, dt);
  const z = solveSpring1D(current[2], target[2], velocity[2], config, dt);
  
  return {
    position: [x.position, y.position, z.position],
    velocity: [x.velocity, y.velocity, z.velocity],
  };
};
