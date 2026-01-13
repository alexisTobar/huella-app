import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-slate-950 font-sans overflow-x-hidden transition-colors duration-500">
      {/* SECCIÓN HERO - IMPACTO TOTAL */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20 pb-32">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100/50 dark:from-orange-900/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-6 py-2 rounded-full shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 mb-10 animate-bounce-slow">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Red Activa en Talagante</span>
          </div>

          <h1 className="text-5xl md:text-[10rem] font-black leading-[0.85] tracking-tighter text-slate-900 dark:text-white uppercase italic mb-8">
            HUELLAS <br /> <span className="text-orange-600 not-italic">SEGURAS</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-lg md:text-2xl font-medium leading-tight mb-12 px-4 uppercase italic">
            La plataforma comunitaria para que ninguna mascota de la provincia se quede sin volver a casa.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link 
              to="/reportes" 
              className="bg-slate-900 dark:bg-orange-600 text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl dark:shadow-none hover:bg-orange-600 dark:hover:bg-orange-500 hover:scale-105 transition-all duration-500 w-full md:w-auto"
            >
              Entrar al Tablero 🐾
            </Link>
            <Link 
              to="/publicar" 
              className="bg-white dark:bg-transparent text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-50 dark:hover:bg-white/5 transition-all w-full md:w-auto"
            >
              Reportar Extravío
            </Link>
          </div>
        </div>

        {/* ELEMENTOS DECORATIVOS FLOATANTES */}
        <div className="absolute bottom-20 left-10 text-8xl md:text-[12rem] opacity-20 dark:opacity-10 pointer-events-none select-none -rotate-12 transition-opacity">🐕</div>
        <div className="absolute top-40 right-10 text-8xl md:text-[10rem] opacity-20 dark:opacity-10 pointer-events-none select-none rotate-12 transition-opacity">🐈</div>
      </section>

      {/* SECCIÓN CARACTERÍSTICAS */}
      <section className="bg-slate-900 dark:bg-black py-32 px-4 rounded-[4rem] mx-2 md:mx-6 mb-10 shadow-3xl transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-20">
          <div className="text-center">
            <div className="text-5xl mb-6">🔔</div>
            <h3 className="text-white font-black text-xl uppercase tracking-tighter mb-4">Alertas en Tiempo Real</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase">Notificamos a todos los vecinos conectados apenas se pierde una mascota cerca.</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-6">📍</div>
            <h3 className="text-white font-black text-xl uppercase tracking-tighter mb-4">Mapa Comunitario</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase">Visualiza los últimos avistamientos en un mapa interactivo para coordinar búsquedas.</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-6">🤝</div>
            <h3 className="text-white font-black text-xl uppercase tracking-tighter mb-4">Reputación Social</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase">Gana medallas y puntos por ayudar a otros. Juntos somos la mejor protección.</p>
          </div>
        </div>
      </section>

      {/* FOOTER PEQUEÑO */}
      <div className="text-center pb-20">
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em]">TalaHuellas • 2026</p>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-10%); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
}

export default Landing;