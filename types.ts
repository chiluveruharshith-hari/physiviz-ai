
export enum MotionType {
  PROJECTILE = 'projectile',
  FREE_FALL = 'free_fall',
  LINEAR_ACCELERATION = 'linear_acceleration',
  COLLISION_1D = 'collision_1d',
  CIRCULAR = 'circular'
}

export interface PhysicsObject {
  name: string;
  mass: number;
  initial_velocity?: number;
  initial_position?: { x: number; y: number };
}

export interface InitialConditions {
  velocity?: number;
  angle?: number;
  gravity: number;
  height?: number;
  v1?: number; // for collisions
  v2?: number; // for collisions
  m1?: number;
  m2?: number;
  elasticity?: number; // 1 for elastic, 0 for inelastic
}

export interface PhysicsProblem {
  title: string;
  description: string;
  motion_type: MotionType;
  objects: PhysicsObject[];
  initial_conditions: InitialConditions;
  forces: string[];
  equations: string[];
  unknowns: string[];
  solution_steps: { step: string; explanation: string; formula: string; value: string }[];
}

export interface AppState {
  problem: PhysicsProblem | null;
  isLoading: boolean;
  error: string | null;
}
