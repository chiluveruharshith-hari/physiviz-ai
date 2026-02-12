import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, History, User, Settings, Sparkles, Github, Activity, BookOpen, BarChart3 } from 'lucide-react';
import InputSection from './components/InputSection';
import PhysicsDashboard from './components/PhysicsDashboard';
import { PhysicsAI } from './services/gemini';
import { PhysicsProblem } from './types';

const Home: React.FC = () => {
  const [problem, setProblem] = useState<PhysicsProblem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async (text: string, image?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const ai = new PhysicsAI();
      const result = await ai.parseProblem(text, image);
      setProblem(result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
      {!problem ? (
        <div className="max-w-3xl mx-auto py-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-slate-900 mb-4">
              Physics problems, <br />
              <span className="text-blue-600">visualized instantly.</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Input any word problem and our AI will generate interactive simulations.
            </p>
          </div>
          <InputSection onProcess={handleProcess} isLoading={isLoading} />
        </div>
      ) : (
        <div>
          <button
            onClick={() => setProblem(null)}
            className="text-sm font-semibold text-blue-600 hover:underline mb-4"
          >
            ← Back
          </button>
          <PhysicsDashboard problem={problem} />
        </div>
      )}

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl">
          Error: {error}
        </div>
      )}
    </main>
  );
};

const Library = () => <div className="p-10 text-center text-xl">📚 Library Page (Coming Soon)</div>;
const Community = () => <div className="p-10 text-center text-xl">🌍 Community Page (Coming Soon)</div>;
const Docs = () => <div className="p-10 text-center text-xl">📖 Docs Page (Coming Soon)</div>;
const SignIn = () => <div className="p-10 text-center text-xl">🔐 Sign In Page (Add Auth Later)</div>;

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-black text-slate-900">
                PhysiViz <span className="text-blue-600">AI</span>
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/library" className="text-sm font-medium hover:text-blue-600">Library</Link>
              <Link to="/community" className="text-sm font-medium hover:text-blue-600">Community</Link>
              <Link to="/docs" className="text-sm font-medium hover:text-blue-600">Docs</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/signin"
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold"
              >
                <User size={16} />
                Sign In
              </Link>
            </div>
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/community" element={<Community />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          © 2024 PhysiViz AI
        </footer>
      </div>
    </Router>
  );
};

export default App;
