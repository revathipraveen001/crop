
import React, { useState, useEffect } from 'react';
import { Thermometer, CloudRain, Calendar, Sprout, Loader2, MapPin, RefreshCw } from 'lucide-react';
import { getCropRecommendations } from './geminiService';
import { CropRecommendation, Season } from './types';

const App: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(28);
  const [rainfall, setRainfall] = useState<number>(1200);
  const [season, setSeason] = useState<string>('Kharif');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<CropRecommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocation denied", err)
      );
    }
  }, []);

  const handleRecommend = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCropRecommendations({
        temperature,
        rainfall,
        season,
        location: location || undefined
      });
      setResults(response.crops);
    } catch (err) {
      setError("Failed to get recommendations. Please check your API key or network connection.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResults(null);
    setTemperature(28);
    setRainfall(1200);
    setSeason('Kharif');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center gap-3 mb-10">
        <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-100">
          <Sprout className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Smart Crop Recommendation</h1>
          <p className="text-slate-500 font-medium">Precision Agriculture Powered by Gemini AI</p>
        </div>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8">
          <div className="space-y-6">
            {/* Temperature Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  Temperature (°C)
                </label>
                <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-bold border border-orange-100">
                  {temperature}°C
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="60" 
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-400 px-1">
                <span>0°C</span>
                <span>30°C</span>
                <span>60°C</span>
              </div>
            </div>

            {/* Rainfall Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  Rainfall (mm)
                </label>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-bold border border-blue-100">
                  {rainfall} mm
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="3000" 
                step="50"
                value={rainfall}
                onChange={(e) => setRainfall(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-400 px-1">
                <span>0 mm</span>
                <span>1500 mm</span>
                <span>3000 mm</span>
              </div>
            </div>

            {/* Season Select */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Select Season
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Kharif', 'Rabi', 'Zaid'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeason(s)}
                    className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all border ${
                      season === s 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {location && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-2 rounded-xl">
                <MapPin className="w-3 h-3" />
                Location synchronized: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            )}
          </div>

          <button
            onClick={handleRecommend}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              'Get Recommended Crops'
            )}
          </button>
        </section>

        {/* Results Panel */}
        <section className="space-y-6">
          {!results && !loading && !error && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-10 h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Sprout className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800">Ready for Analysis</h3>
              <p className="text-emerald-700/70 max-w-xs">
                Adjust the environmental parameters and click recommend to see the best crops for your conditions.
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-3xl flex flex-col items-center text-center space-y-4">
               <p className="font-medium">{error}</p>
               <button onClick={handleRecommend} className="text-sm font-bold underline">Try again</button>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-slate-800">Top 3 Recommended Crops</h2>
                <button 
                  onClick={resetForm}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                  title="Reset Search"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              
              {results.map((crop, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex gap-5 group"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {crop.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-slate-800">{crop.name}</h3>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                        <span className="text-xs font-black">{(crop.score * 100).toFixed(0)}%</span>
                        <div className="w-12 h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500" 
                            style={{ width: `${crop.score * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {crop.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">Agricultural Insights</h4>
                    <p className="text-slate-400 text-xs">Based on current climatic data trends</p>
                  </div>
                  <Sprout className="w-10 h-10 opacity-20 absolute -right-2 -bottom-2 rotate-12" />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-16 text-slate-400 text-sm flex flex-col items-center gap-2">
        <p>&copy; 2024 SmartAgri Advisor • AI-First Agriculture</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a>
          <span>•</span>
          <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-emerald-500 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
