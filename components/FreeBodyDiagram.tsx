
import React from 'react';
import { PhysicsProblem } from '../types';

interface Props {
  problem: PhysicsProblem;
}

const FreeBodyDiagram: React.FC<Props> = ({ problem }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Free Body Diagram</h3>
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="bg-slate-50 rounded-xl">
          {/* Central Object */}
          <circle cx="100" cy="100" r="10" fill="#2563eb" />
          <text x="115" y="105" fontSize="10" className="font-bold fill-slate-700">m</text>
          
          {/* Gravity Vector */}
          {problem.forces.includes('gravity') && (
            <g>
              <line x1="100" y1="100" x2="100" y2="160" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="105" y="155" fontSize="10" className="fill-red-600 font-bold">F_g (mg)</text>
            </g>
          )}

          {/* Normal Force (if not free fall) */}
          {problem.forces.includes('normal') && (
            <g>
              <line x1="100" y1="100" x2="100" y2="40" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead-up)" />
              <text x="105" y="55" fontSize="10" className="fill-emerald-600 font-bold">F_n</text>
            </g>
          )}

          {/* Applied Force or Tension */}
          {(problem.forces.includes('tension') || problem.forces.includes('applied')) && (
            <g>
              <line x1="100" y1="100" x2="160" y2="100" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrowhead-right)" />
              <text x="140" y="90" fontSize="10" className="fill-violet-600 font-bold">F_a</text>
            </g>
          )}

          {/* Definitions for arrowheads */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
            <marker id="arrowhead-up" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
            </marker>
            <marker id="arrowhead-right" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#7c3aed" />
            </marker>
          </defs>
        </svg>
        <p className="mt-4 text-[11px] text-slate-500 italic text-center">
          Active Forces: {problem.forces.join(', ')}
        </p>
      </div>
    </div>
  );
};

export default FreeBodyDiagram;
