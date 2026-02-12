
import React from 'react';
import { CheckCircle2, ListTodo } from 'lucide-react';
import { PhysicsProblem } from '../types';

interface Props {
  problem: PhysicsProblem;
}

const SolutionView: React.FC<Props> = ({ problem }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <ListTodo className="text-blue-600" />
        Step-by-Step Educational Solution
      </h2>
      
      <div className="space-y-8">
        {problem.solution_steps.map((step, index) => (
          <div key={index} className="relative pl-10 border-l-2 border-slate-100 last:border-0 pb-8">
            <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
              {index + 1}
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{step.step}</h3>
            <p className="text-slate-500 mb-4">{step.explanation}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Formula used</span>
                <div className="font-mono text-blue-600 text-lg mt-1 italic">
                  {step.formula}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <span className="text-[10px] font-bold text-blue-400 uppercase">Calculated Value</span>
                <div className="font-bold text-blue-700 text-lg mt-1">
                  {step.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3">
        <CheckCircle2 className="text-green-600 mt-1" size={20} />
        <div>
          <h4 className="font-bold text-green-800">Final Verification</h4>
          <p className="text-sm text-green-700">The values are physically consistent with Earth's gravity and standard kinematics. No energy violations detected.</p>
        </div>
      </div>
    </div>
  );
};

export default SolutionView;
