
import React, { useState, useRef } from 'react';
import { Camera, Mic, Send, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Props {
  onProcess: (text: string, image?: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<Props> = ({ onProcess, isLoading }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    onProcess(text, image || undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Send size={20} className="text-blue-600" />
        Describe your Physics Problem
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Example: A ball is thrown from a 10m building at 20m/s at a 30 degree angle. How far does it land?"
          className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700 resize-none"
        />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <ImageIcon size={18} />
              {image ? 'Image Added' : 'Upload Image'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
            
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Voice input simulated for hackathon"
            >
              <Mic size={18} />
              Voice
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !image)}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Problem
                <Send size={18} />
              </>
            )}
          </button>
        </div>
        {image && (
          <div className="mt-2 text-xs text-blue-600 font-medium bg-blue-50 p-2 rounded inline-block">
            ✓ Image selected for analysis
          </div>
        )}
      </form>
    </div>
  );
};

export default InputSection;
