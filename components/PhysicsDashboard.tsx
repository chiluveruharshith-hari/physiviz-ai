
import React, { useState } from 'react';
import { 
  BookOpen, 
  Activity, 
  BarChart3, 
  CircleDot, 
  ArrowRight,
  Calculator,
  Grip
} from 'lucide-react';
import { PhysicsProblem } from '../types';
import Simulator from './Simulator';
import PhysicsGraphs from './PhysicsGraphs';
import SolutionView from './SolutionView';
import FreeBodyDiagram from './FreeBodyDiagram';
import TrajectoryVisualization from './TrajectoryVisualization';

interface Props {
  problem: PhysicsProblem;
}

const PhysicsDashboard: React.FC<Props> = ({ problem }) => {
  const [activeTab, setActiveTab] = useState<'visualize' | 'solution' | 'graphs'>('visualize');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{problem.title}</h1>
          <p className="text-slate-500 max-w-2xl mt-1">{problem.description}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('visualize')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'visualize' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Activity size={18} />
            Visualize
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'solution' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <BookOpen size={18} />
            Solution
          </button>
          <button
            onClick={() => setActiveTab('graphs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'graphs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <BarChart3 size={18} />
            Graphs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'visualize' && (
            <>
              <Simulator problem={problem} />
              <TrajectoryVisualization problem={problem} />
            </>
          )}
          {activeTab === 'solution' && <SolutionView problem={problem} />}
          {activeTab === 'graphs' && <PhysicsGraphs problem={problem} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calculator size={14} />
                  Problem Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-600 text-sm">Motion Type</span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded uppercase">{problem.motion_type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-600 text-sm">Key Forces</span>
                    <div className="flex gap-1">
                      {problem.forces.map(f => (
                        <span key={f} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 text-sm">Seeking</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {problem.unknowns.map(u => (
                        <span key={u} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded">{u}</span>
                      ))}
                    </div>
                  </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Grip size={14} />
                  Key Formulas
                </h3>
                <div className="space-y-2">
                  {problem.equations.map((eq, i) => (
                    <div key={i} className="font-mono text-sm bg-slate-50 p-2 rounded text-slate-700 border border-slate-100">
                      {eq}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <FreeBodyDiagram problem={problem} />
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-200">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <CircleDot size={20} />
              AI Insights
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              I've detected this as a <strong>{problem.motion_type.replace('_', ' ')}</strong> problem. 
              The most critical factor here is {problem.forces.includes('friction') ? 'the surface friction' : 'the trajectory parabolic nature'}.
            </p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
              Explain Energy Changes
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsDashboard;
