import { useState, useEffect } from 'react';
import api from '../api/axios';

function Marketplace() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState(''); // MEJORA: Estado para el buscador
  
  // MODAL MEJORADO: Soporte para múltiples fotos y carrusel
  const [modalData, setModalData] = useState({ isOpen: false, fotos: [], index: 0 });

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await api.get('/productos');
        setProductos(res.data);
      } catch (error) { 
        console.error("Error al obtener productos:", error); 
      }
    };
    obtenerProductos();
  }, []);

  const categorias = ['Todos', 'Alimento', 'Accesorios', 'Salud', 'Juguetes'];

  // MEJORA: LÓGICA DE FILTRADO COMBINADA (Filtro por Categoría + Buscador de Texto)
  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = filtro === 'Todos' || p.categoria === filtro;
    const coincideBusqueda = 
      p.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    
    return coincideCategoria && coincideBusqueda;
  });

  // Funciones para navegar en el carrusel del modal
  const nextImagen = (e) => {
    e.stopPropagation();
    setModalData(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.fotos.length
    }));
  };

  const prevImagen = (e) => {
    e.stopPropagation();
    setModalData(prev => ({
      ...prev,
      index: (prev.index - 1 + prev.fotos.length) % prev.fotos.length
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 max-w-7xl mx-auto px-4 pb-32 overflow-x-hidden font-sans transition-colors duration-500">
      
      {/* 1. HERO MARKETPLACE - Full Responsive */}
      <div className="relative bg-emerald-900 dark:bg-black rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-16 mb-8 md:mb-12 overflow-hidden shadow-2xl border border-white/5 mt-4 md:mt-6">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500 skew-x-12 translate-x-20 opacity-20 dark:opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 text-center md:text-left">
          <div className="max-w-xl">
            <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase mb-4 md:mb-6 inline-block shadow-lg">
              Comercio Local Talagante
            </span>
            <h1 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 leading-tight text-white tracking-tighter uppercase italic">
              Todo para tu <br />
              <span className="text-emerald-400 not-italic">mascota feliz.</span>
            </h1>
            <p className="text-emerald-100/60 dark:text-emerald-500/60 text-sm md:text-lg font-medium uppercase tracking-wider">
              Encuentra los mejores productos de emprendedores de nuestra zona.
            </p>
          </div>
          <div className="flex items-center gap-4 animate-bounce-slow transform scale-75 md:scale-100">
            <span className="text-[6rem] md:text-[10rem] drop-shadow-2xl">🦴</span>
            <span className="text-[4rem] md:text-[8rem] drop-shadow-2xl opacity-50 -ml-8">🛍️</span>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE BUSQUEDA Y FILTROS - Diseño Pro Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <h2 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase flex items-center gap-3">
            <span className="w-2 h-8 md:w-3 md:h-10 bg-emerald-500 rounded-full"></span>
            Mercado
          </h2>
          
          {/* MEJORA: INPUT DE BUSQUEDA CON ESTILO ESMERALDA */}
          <div className="relative w-full md:w-80 group">
            <input 
              type="text" 
              placeholder="Buscar alimento, juguetes..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-10 outline-none font-bold text-slate-600 dark:text-slate-300 shadow-sm focus:border-emerald-500 transition-all text-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm grayscale group-focus-within:grayscale-0 transition-all">🔍</span>
            {busqueda && (
              <button 
                onClick={() => setBusqueda('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors font-bold"
              >✕</button>
            )}
          </div>
        </div>

        {/* FILTROS CON SCROLL HORIZONTAL EN MÓVIL */}
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar max-w-full">
          <div className="flex gap-1 min-w-max">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-5 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${
                  filtro === cat 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GRID DE PRODUCTOS - 2 columnas en móvil, 4 en desktop */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center py-16 md:py-24 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-emerald-100 dark:border-emerald-900/50 mx-2 animate-fade-in">
          <span className="text-5xl md:text-7xl mb-4 block opacity-50">{busqueda ? '🔍' : '🛒'}</span>
          <p className="text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest text-sm md:text-xl">
            {busqueda ? `No hay resultados para "${busqueda}"` : 'Sin stock por ahora'}
          </p>
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="mt-4 text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:underline">Limpiar búsqueda</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {productosFiltrados.map((prod) => (
            <div key={prod._id} className="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] p-2 md:p-4 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl dark:hover:shadow-emerald-900/10 transition-all duration-500 flex flex-col h-full group">
              
              <div 
                className="h-40 md:h-64 rounded-[1.2rem] md:rounded-[2rem] overflow-hidden mb-3 md:mb-6 relative cursor-zoom-in"
                onClick={() => setModalData({ 
                  isOpen: true, 
                  fotos: prod.fotos?.length > 0 ? prod.fotos : [prod.fotoUrl], 
                  index: 0 
                })}
              >
                <img 
                  src={prod.fotos?.[0] || prod.fotoUrl} 
                  alt={prod.titulo} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                
                {prod.fotos?.length > 1 && (
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] md:text-[10px] text-white font-black">
                    📸 {prod.fotos.length}
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-white/90 dark:bg-emerald-600/90 backdrop-blur px-2 py-0.5 rounded-full text-[7px] md:text-[10px] font-black text-emerald-700 dark:text-white uppercase tracking-tighter">
                  {prod.categoria}
                </div>
              </div>

              <div className="px-1 md:px-2 flex flex-col flex-grow">
                <h3 className="text-xs md:text-xl font-black text-slate-800 dark:text-white leading-tight mb-2 md:mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2 uppercase tracking-tighter h-8 md:h-14">
                  {prod.titulo}
                </h3>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 bg-emerald-50 dark:bg-emerald-900/20 p-2 md:p-3 rounded-xl md:rounded-2xl border border-emerald-100 dark:border-emerald-900/30 mt-auto">
                  <span className="text-[7px] md:text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Precio</span>
                  <span className="text-sm md:text-2xl font-black text-emerald-700 dark:text-emerald-400">${Number(prod.precio).toLocaleString('es-CL')}</span>
                </div>

                <a 
                  href={`https://wa.me/${prod.whatsappVendedor}`} 
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-1 md:gap-2 w-full bg-slate-900 dark:bg-emerald-600 text-white py-2.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all active:scale-95 shadow-md"
                >
                  <span className="text-sm md:text-lg">💬</span>
                  Consultar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL CARRUSEL - Full Responsive --- */}
      {modalData.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-slate-900/95 dark:bg-black/98 backdrop-blur-md animate-fade-in" onClick={() => setModalData({ ...modalData, isOpen: false })}>
          <button className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-900 dark:text-white text-xl md:text-2xl font-bold shadow-2xl z-[210]">✕</button>

          <div className="relative max-w-4xl w-full flex flex-col items-center gap-4 md:gap-6" onClick={e => e.stopPropagation()}>
            <div className="relative w-full flex justify-center items-center">
              {modalData.fotos.length > 1 && (
                <button onClick={prevImagen} className="absolute left-2 md:-left-20 bg-white/10 hover:bg-emerald-500 w-10 h-10 md:w-14 md:h-14 rounded-full text-white transition-all flex items-center justify-center text-xl z-10">❮</button>
              )}
              
              <img src={modalData.fotos[modalData.index]} className="max-w-full max-h-[70vh] md:max-h-[85vh] rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border-2 md:border-4 border-white/10 dark:border-emerald-500/20 object-contain" alt="Producto" />
              
              {modalData.fotos.length > 1 && (
                <button onClick={nextImagen} className="absolute right-2 md:-right-20 bg-white/10 hover:bg-emerald-500 w-10 h-10 md:w-14 md:h-14 rounded-full text-white transition-all flex items-center justify-center text-xl z-10">❯</button>
              )}
            </div>

            {/* Paginación Visual */}
            <div className="flex gap-2 md:gap-3">
              {modalData.fotos.map((_, i) => (
                <div key={i} className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${i === modalData.index ? 'w-6 md:w-10 bg-emerald-400' : 'w-1.5 md:w-2 bg-white/20'}`}></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(-3%); } 50% { transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default Marketplace;