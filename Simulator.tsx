
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, SlidersHorizontal, Info } from 'lucide-react';
import { PhysicsProblem, MotionType } from '../types';

interface Props {
  problem: PhysicsProblem;
}

const Simulator: React.FC<Props> = ({ problem }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  
  // Real-time parameters
  const [velocity, setVelocity] = useState(problem.initial_conditions.velocity || 0);
  const [angle, setAngle] = useState(problem.initial_conditions.angle || 0);
  const [gravity, setGravity] = useState(problem.initial_conditions.gravity || 9.8);
  const [mass, setMass] = useState(problem.objects[0]?.mass || 1);

  // For Collisions
  const [v1, setV1] = useState(problem.initial_conditions.v1 || 10);
  const [v2, setV2] = useState(problem.initial_conditions.v2 || 0);
  const [m1, setM1] = useState(problem.initial_conditions.m1 || 1);
  const [m2, setM2] = useState(problem.initial_conditions.m2 || 1);

  useEffect(() => {
    let animationId: number;
    if (isPlaying) {
      const start = performance.now();
      const tick = () => {
        setTime((prev) => prev + 0.05);
        animationId = requestAnimationFrame(tick);
      };
      animationId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Ground line
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(0, height - 50);
    ctx.lineTo(width, height - 50);
    ctx.stroke();

    const scale = 15; // px per meter
    const startX = 50;
    const startY = height - 50;

    if (problem.motion_type === MotionType.PROJECTILE || problem.motion_type === MotionType.FREE_FALL) {
      const rad = (angle * Math.PI) / 180;
      const vx = velocity * Math.cos(rad);
      const vy0 = -velocity * Math.sin(rad);

      // Calculate time to hit ground (y = 0 from startY)
      // Using: y = vy0*t + 0.5*g*t^2
      // When y = startY (ground): 0 = vy0*t + 0.5*g*t^2
      // t = -2*vy0/g (when vy0 is negative for upward, this gives positive t)
      const timeToGround = vx > 0 ? (startY / (0.5 * gravity * scale)) * 2 : 10;
      const maxTime = Math.max(timeToGround * 1.2, 5); // Add 20% buffer

      // Draw complete trajectory path
      ctx.setLineDash([8, 4]);
      ctx.strokeStyle = '#0ea5e9'; // Bright blue for visibility
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      let firstPoint = true;
      for (let t = 0; t <= maxTime; t += 0.05) {
        const tx = startX + vx * t * scale;
        const ty = startY + (vy0 * t + 0.5 * gravity * t * t) * scale;
        
        // Stop if object hits ground or goes off screen
        if (ty > startY) break;
        if (tx > width + 50) break;
        
        if (firstPoint) {
          ctx.moveTo(tx, ty);
          firstPoint = false;
        } else {
          ctx.lineTo(tx, ty);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw path points/markers along trajectory for better visualization
      ctx.fillStyle = '#06b6d4';
      ctx.globalAlpha = 0.6;
      const markerInterval = maxTime / 8; // Show ~8 markers
      for (let t = 0; t <= maxTime; t += markerInterval) {
        const tx = startX + vx * t * scale;
        const ty = startY + (vy0 * t + 0.5 * gravity * t * t) * scale;
        if (ty > startY || tx > width + 50) break;
        ctx.beginPath();
        ctx.arc(tx, ty, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Current position
      const x = startX + vx * time * scale;
      const y = startY + (vy0 * time + 0.5 * gravity * time * time) * scale;

      // The Object (Ball)
      if (y <= startY) {
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Ball glow effect
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Label
        ctx.fillStyle = '#1e293b';
        ctx.font = '12px Inter';
        ctx.fillText(`${problem.objects[0]?.name || 'Object'}`, x - 20, y - 20);

        // Velocity Vector (Arrow)
        const curVy = vy0 + gravity * time;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + vx * 2, y + curVy * 2);
        ctx.stroke();
      } else {
        setIsPlaying(false);
      }
    }

    if (problem.motion_type === MotionType.COLLISION_1D) {
      // Simple 1D Elastic Collision Logic
      const gap = 100;
      const pos1_0 = 100;
      const pos2_0 = 400;
      
      // Calculate collision time
      const relVel = v1 - v2;
      const dist = pos2_0 - pos1_0 - 40; // sizes
      const t_collision = relVel > 0 ? dist / (relVel * scale) : Infinity;

      let p1, p2, curV1, curV2;

      if (time < t_collision) {
        p1 = pos1_0 + v1 * time * scale;
        p2 = pos2_0 + v2 * time * scale;
        curV1 = v1;
        curV2 = v2;
      } else {
        // Post collision velocities
        const postV1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
        const postV2 = (2 * m1 * v1 + (m2 - m1) * v2) / (m1 + m2);
        const t_after = time - t_collision;
        p1 = (pos1_0 + v1 * t_collision * scale) + postV1 * t_after * scale;
        p2 = (pos2_0 + v2 * t_collision * scale) + postV2 * t_after * scale;
        curV1 = postV1;
        curV2 = postV2;
      }

      // Draw Object 1
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(p1, startY - 40, 40, 40);
      ctx.fillStyle = 'white';
      ctx.fillText('m1', p1 + 10, startY - 15);
      
      // Draw Object 2
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(p2, startY - 40, 40, 40);
      ctx.fillStyle = 'white';
      ctx.fillText('m2', p2 + 10, startY - 15);

      // Stats
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter';
      ctx.fillText(`v1: ${curV1.toFixed(1)} m/s`, p1, startY - 50);
      ctx.fillText(`v2: ${curV2.toFixed(1)} m/s`, p2, startY - 50);
    }
  };

  useEffect(() => {
    draw();
  }, [time, velocity, angle, gravity, mass, v1, v2, m1, m2]);

  const reset = () => {
    setTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button 
            onClick={reset}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
        <div className="text-white font-mono text-sm">
          Time: {time.toFixed(2)}s
        </div>
      </div>
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="w-full h-[400px] bg-slate-50 cursor-crosshair"
        />
        
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-sm max-w-xs">
          <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold border-b pb-2">
            <SlidersHorizontal size={16} />
            What-If Scenarios
          </div>
          
          <div className="space-y-4">
            {problem.motion_type !== MotionType.COLLISION_1D ? (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Velocity ({velocity} m/s)</label>
                  <input 
                    type="range" min="0" max="100" step="1" value={velocity}
                    onChange={(e) => { setVelocity(Number(e.target.value)); reset(); }}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Angle ({angle}°)</label>
                  <input 
                    type="range" min="0" max="90" step="1" value={angle}
                    onChange={(e) => { setAngle(Number(e.target.value)); reset(); }}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </>
            ) : (
              <>
                 <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">v1 ({v1} m/s)</label>
                  <input 
                    type="range" min="-50" max="50" step="1" value={v1}
                    onChange={(e) => { setV1(Number(e.target.value)); reset(); }}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">m1 ({m1} kg)</label>
                  <input 
                    type="range" min="0.1" max="10" step="0.1" value={m1}
                    onChange={(e) => { setM1(Number(e.target.value)); reset(); }}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Gravity ({gravity} m/s²)</label>
              <input 
                type="range" min="0" max="30" step="0.1" value={gravity}
                onChange={(e) => { setGravity(Number(e.target.value)); reset(); }}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
