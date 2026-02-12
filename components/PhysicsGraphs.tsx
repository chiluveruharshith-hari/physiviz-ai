
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { PhysicsProblem, MotionType } from '../types';

interface Props {
  problem: PhysicsProblem;
}

const PhysicsGraphs: React.FC<Props> = ({ problem }) => {
  const generateData = () => {
    const data = [];
    const gravity = problem.initial_conditions.gravity || 9.8;
    const v0 = problem.initial_conditions.velocity || 0;
    const angleRad = ((problem.initial_conditions.angle || 0) * Math.PI) / 180;
    
    const vx = v0 * Math.cos(angleRad);
    const vy0 = v0 * Math.sin(angleRad);

    // Calculate time of flight for graph bounds
    let maxT = 5;
    if (problem.motion_type === MotionType.PROJECTILE && vy0 > 0) {
      maxT = (2 * vy0) / gravity;
      if (maxT < 2) maxT = 5;
    }

    for (let t = 0; t <= maxT; t += maxT / 20) {
      const y = vy0 * t - 0.5 * gravity * t * t;
      const vy = vy0 - gravity * t;
      data.push({
        time: t.toFixed(2),
        y: Math.max(0, y).toFixed(2),
        vy: vy.toFixed(2),
        vx: vx.toFixed(2)
      });
    }
    return data;
  };

  const data = generateData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Position (Y) vs Time (s)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" hide />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="y" stroke="#2563eb" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Velocity (Vy) vs Time (s)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" hide />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="vy" stroke="#ef4444" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PhysicsGraphs;
