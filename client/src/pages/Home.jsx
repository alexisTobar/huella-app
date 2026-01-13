import { useState, useEffect, lazy, Suspense } from 'react';
import api from '../api/axios';
import MapaComunidad from '../components/MapaComunidad'; 
// --- NUEVA IMPORTACIÓN ---
import { toast } from 'sonner';
// -------------------------

function Home() {
  const [mascotas, setMascotas] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState(''); 
  const [vista, setVista] = useState('lista'); 
  
  // CORREGIDO: Se añadió useState correctamente
  const [modalData, setModalData] = useState({ isOpen: false, fotos: [], index: 0 });
  
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerMascotas = async () => {
      try {
        const res = await api.get('/mascotas');
        setMascotas(res.data);
      } catch (error) { 
        console.error("Error al obtener mascotas:", error); 
      }
    };
    obtenerMascotas();
  }, []);

  const getIcono = (tipo) => {
    switch(tipo) {
      case 'Gato': return '🐱';
      case 'Ave': case 'Loro': return '🦜';
      case 'Otro': return '🐾';
      default: return '🐶';
    }
  };

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

  // --- FUNCIÓN DE AVISTAMIENTO MEJORADA CON SONNER ---
  const handleAvistamiento = (pet) => {
    toast.custom((t) => (
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 p-5 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 min-w-[320px] animate-in slide-in-from-top-4 duration-500">
        <div className="relative">
          <img 
            src={pet.fotos?.[0] || pet.fotoUrl} 
            className="w-16 h-16 rounded-full object-cover border-4 border-orange-500 shadow-lg"
            alt="pet"
          />
          <span className="absolute -bottom-1 -right-1 text-xl">📍</span>
        </div>
        
        <div className="text-center">
          <h3 className="font-black text-[12px] text-slate-900 uppercase tracking-tighter">¿Viste a {pet.nombre}?</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 leading-tight">
            Enviaremos tu ubicación GPS al dueño <br/> para ayudar en el rescate.
          </p>
        </div>

        <div className="flex gap-2 w-full">
          <button 
            onClick={() => toast.dismiss(t)}
            className="flex-1 bg-slate-100 text-slate-500 text-[9px] font-black py-3 rounded-2xl uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              toast.dismiss(t);
              procesarEnvioUbicacion(pet);
            }}
            className="flex-1 bg-orange-600 text-white text-[9px] font-black py-3 rounded-2xl uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
          >
            SÍ, ENVIAR
          </button>
        </div>
      </div>
    ), { duration: 15000 });
  };

  const procesarEnvioUbicacion = (pet) => {
    const mensajeBase = `¡Hola! Acabo de ver a ${pet.nombre} que reportaste como perdido en TalaHuellas. `;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapaUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const mensajeCompleto = `${mensajeBase} Estoy en esta ubicación: ${mapaUrl}`;
          
          toast.success(`UBICACIÓN ENVIADA`, {
            description: `Se ha abierto WhatsApp para contactar al dueño.`,
            icon: '✅'
          });

          window.open(`https://wa.me/${pet.contacto?.telefono || pet.telefono}?text=${encodeURIComponent(mensajeCompleto)}`, '_blank');
        },
        () => {
          toast.error("GPS desactivado", { description: "Se envió el mensaje sin coordenadas exactas." });
          window.open(`https://wa.me/${pet.contacto?.telefono || pet.telefono}?text=${encodeURIComponent(mensajeBase + " No pude compartir mi ubicación exacta, pero lo vi por aquí cerca.")}`, '_blank');
        }
      );
    } else {
      window.open(`https://wa.me/${pet.contacto?.telefono || pet.telefono}?text=${encodeURIComponent(mensajeBase)}`, '_blank');
    }
  };
  // ----------------------------------------------------

  const mascotasFiltradas = mascotas.filter(m => {
    const coincideTipo = filtro === 'Todos' || m.tipo === filtro;
    const coincideBusqueda = 
      m.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.comuna?.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.ubicacion?.toLowerCase().includes(busqueda.toLowerCase());
    
    return coincideTipo && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] max-w-7xl mx-auto px-3 md:px-4 pb-24 overflow-x-hidden font-sans text-slate-900">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-20 mb-8 md:mb-16 overflow-hidden shadow-2xl border border-white/5 mt-4 md:mt-6">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-orange-500/20 to-transparent md:skew-x-12 translate-x-0 md:translate-x-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="animate-fade-in-left text-center md:text-left">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[9px] md:text-xs font-black tracking-widest uppercase mb-4 md:mb-6 inline-block shadow-lg">Comunidad Talagante</span>
            <h1 className="text-3xl md:text-7xl font-black mb-4 md:mb-6 leading-tight text-white tracking-tighter uppercase">
              Protegiendo a nuestros <br className="hidden md:block" />
              <span className="text-orange-500 underline decoration-white/10">mejores amigos.</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-lg font-medium mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">Red ciudadana de reporte y rescate en la Provincia del Maipo.</p>
            
            <div className="flex justify-center md:justify-start gap-2 md:gap-4">
               <div className="bg-white/5 border border-white/10 p-3 md:p-4 rounded-2xl md:rounded-3xl backdrop-blur-md min-w-[80px] md:min-w-[120px]">
                  <p className="text-xl md:text-3xl font-black text-white">{mascotas.length}</p>
                  <p className="text-[7px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">Activos</p>
               </div>
               <div className="bg-white/5 border border-white/10 p-3 md:p-4 rounded-2xl md:rounded-3xl backdrop-blur-md min-w-[80px] md:min-w-[120px]">
                  <p className="text-xl md:text-3xl font-black text-orange-500">24/7</p>
                  <p className="text-[7px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">Alerta</p>
               </div>
            </div>
          </div>
          
          <div className="relative flex justify-center items-center mt-4 md:mt-0">
            <div className="absolute w-40 h-40 md:w-72 md:h-72 bg-orange-500/20 rounded-full blur-[40px] md:blur-[80px]"></div>
            <div className="relative flex items-end gap-1 md:gap-2 animate-bounce-slow transform scale-60 sm:scale-75 md:scale-100 pointer-events-none">
              <span className="text-[6rem] md:text-[15rem] drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]">🐕</span>
              <span className="text-[4.5rem] md:text-[11rem] drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] -ml-8 md:-ml-12 mb-2 md:mb-4 bg-slate-900/40 backdrop-blur-sm rounded-full">🐈</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BUSCADOR, FILTROS Y SELECTOR DE VISTA */}
      <div className="flex flex-col gap-6 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-2 md:gap-3">
              <span className="w-2 md:w-3 h-6 md:h-8 bg-orange-500 rounded-full"></span>Tablero
            </h2>
            
            <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
              <button 
                onClick={() => setVista('lista')}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${vista === 'lista' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}
              >
                Lista
              </button>
              <button 
                onClick={() => setVista('mapa')}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${vista === 'mapa' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400'}`}
              >
                Mapa 📍
              </button>
            </div>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <input 
              type="text" 
              placeholder="Nombre, raza o comuna..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl md:rounded-2xl py-3 px-10 outline-none font-bold text-slate-600 shadow-sm focus:border-orange-500 transition-all text-xs"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm grayscale group-focus-within:grayscale-0 transition-all">🔍</span>
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors font-bold">✕</button>
            )}
          </div>
        </div>

        <div className="flex bg-white p-1 md:p-1.5 rounded-xl md:rounded-2xl shadow-md border border-slate-100 overflow-x-auto max-w-full no-scrollbar">
          <div className="flex gap-1 min-w-max px-1">
            {['Todos', 'Perro', 'Gato', 'Ave', 'Otro'].map((cat) => (
              <button key={cat} onClick={() => setFiltro(cat)}
                className={`px-4 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${
                  filtro === cat ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                }`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GRID DE TARJETAS */}
      {vista === 'lista' ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {mascotasFiltradas.length > 0 ? (
            mascotasFiltradas.map((pet) => (
              <div key={pet._id} className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                <div 
                  className="relative h-36 sm:h-44 md:h-52 overflow-hidden cursor-zoom-in" 
                  onClick={() => setModalData({ isOpen: true, fotos: pet.fotos || [pet.fotoUrl], index: 0 })}
                >
                  <img src={pet.fotos?.[0] || pet.fotoUrl} alt={pet.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-2 md:top-3 left-2 md:left-3 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[6px] md:text-[7px] font-black uppercase text-white shadow-lg backdrop-blur-md ${pet.categoria === 'Perdida' ? 'bg-red-500/90' : 'bg-orange-500/90'}`}>
                    {pet.categoria}
                  </div>
                  <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 bg-white/90 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-md md:rounded-lg shadow-md text-xs md:text-sm">
                    {getIcono(pet.tipo)}
                  </div>
                </div>

                <div className="p-3 md:p-5 flex flex-col flex-grow gap-2">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm md:text-xl font-black text-slate-800 tracking-tighter uppercase truncate leading-tight">{pet.nombre}</h3>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setPerfilSeleccionado(pet.usuario); 
                        }}
                        className="text-[7px] font-black text-orange-500 hover:underline uppercase tracking-tighter"
                      >
                        👤 {pet.usuario?.nombre ? 'Autor' : 'Ver'}
                      </button>
                    </div>
                    <p className="text-orange-600 text-[7px] md:text-[9px] font-black uppercase tracking-widest mt-0.5 truncate">📍 {pet.comuna}</p>
                  </div>
                  <div className="bg-slate-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-100 flex-grow">
                    <p className="text-slate-600 text-[9px] md:text-xs font-medium leading-tight italic line-clamp-2">{pet.descripcion || "Sin detalles."}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 md:gap-2 pt-1 md:pt-2">
                    {pet.categoria === 'Perdida' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAvistamiento(pet); }}
                        className="w-full py-1.5 md:py-2.5 bg-orange-100 text-orange-600 rounded-lg md:rounded-xl font-black text-[7px] md:text-[9px] uppercase tracking-widest border border-orange-200 hover:bg-orange-500 hover:text-white transition-all animate-pulse active:scale-95"
                      >
                        📍 ¡Lo vi recién!
                      </button>
                    )}
                    <a href={`https://wa.me/${pet.contacto?.telefono || pet.telefono}`} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-slate-900 text-white py-2 md:py-3 rounded-lg md:rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-md">
                      💬 Contactar
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center animate-fade-in">
              <span className="text-5xl block mb-4">🕵️‍♂️</span>
              <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No hay resultados</p>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-fade-in min-h-[500px]">
          <MapaComunidad mascotas={mascotasFiltradas} />
          <p className="text-center mt-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
            📍 Mostrando reportes geolocalizados en la zona
          </p>
        </div>
      )}

      {/* --- MODAL DE PERFIL SOCIAL --- */}
      {perfilSeleccionado && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in" onClick={() => setPerfilSeleccionado(null)}>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPerfilSeleccionado(null)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 font-bold">✕</button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-xl overflow-hidden mb-4 bg-slate-100 flex items-center justify-center">
                {perfilSeleccionado.fotoPerfil ? (
                    <img src={perfilSeleccionado.fotoPerfil} className="w-full h-full object-cover" alt="perfil" />
                ) : (
                    <span className="text-3xl">👤</span>
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">{perfilSeleccionado.nombre || "Vecino Anónimo"}</h2>
              <p className="text-orange-500 font-bold text-[10px] uppercase tracking-widest mt-2">Miembro de la Comunidad</p>
              
              <div className="grid grid-cols-3 gap-3 w-full mt-8">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-lg font-black text-slate-800">{perfilSeleccionado.reputacion || 0}</p>
                  <p className="text-[7px] font-black text-slate-400 uppercase">Puntos</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-lg font-black text-slate-800">{perfilSeleccionado.mascotasReportadas || 0}</p>
                  <p className="text-[7px] font-black text-slate-400 uppercase">Alertas</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-lg font-black text-slate-800">{perfilSeleccionado.mascotasEncontradas || 0}</p>
                  <p className="text-[7px] font-black text-slate-400 uppercase">Rescates</p>
                </div>
              </div>

              <div className="w-full mt-8 text-left">
                <h3 className="text-[9px] font-black uppercase text-slate-400 mb-3 tracking-widest">Medallas Ganadas</h3>
                <div className="flex flex-wrap gap-2">
                  {perfilSeleccionado.reputacion >= 10 && <span className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border border-orange-100">🏅 Colaborador Activo</span>}
                  {perfilSeleccionado.mascotasReportadas >= 1 && <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border border-blue-100">📢 Primer Reporte</span>}
                  <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border border-slate-100">🏠 Nuevo Vecino</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CARRUSEL --- */}
      {modalData.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-slate-900/95 backdrop-blur-md animate-fade-in" onClick={() => setModalData({ ...modalData, isOpen: false })}>
          <button className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-slate-900 text-xl md:text-2xl font-bold z-[210] shadow-xl">✕</button>
          <div className="relative max-w-4xl w-full flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
            <div className="relative w-full flex justify-center items-center">
              {modalData.fotos.length > 1 && (
                <button onClick={prevImagen} className="absolute left-2 md:-left-16 bg-white/10 hover:bg-orange-500 w-10 h-10 md:w-12 md:h-12 rounded-full text-white transition-all flex items-center justify-center text-lg z-[210]">❮</button>
              )}
              <img src={modalData.fotos[modalData.index]} className="max-w-full max-h-[70vh] md:max-h-[75vh] rounded-2xl md:rounded-3xl shadow-2xl border-2 md:border-4 border-white/10 object-contain shadow-orange-500/20" alt="Vista" />
              {modalData.fotos.length > 1 && (
                <button onClick={nextImagen} className="absolute right-2 md:-right-16 bg-white/10 hover:bg-orange-500 w-10 h-10 md:w-12 md:h-12 rounded-full text-white transition-all flex items-center justify-center text-lg z-[210]">❯</button>
              )}
            </div>
            <div className="flex gap-2 pb-4">
              {modalData.fotos.map((_, i) => (
                <div key={i} className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${i === modalData.index ? 'w-6 md:w-8 bg-orange-500' : 'w-1.5 md:w-2 bg-white/30'}`}></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(-3%); } 50% { transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default Home;