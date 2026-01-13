import { useState, useEffect } from 'react';
import api from '../api/axios';
import MapaComunidad from '../components/MapaComunidad'; 
import { toast } from 'sonner';

function Home() {
  const [mascotas, setMascotas] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState(''); 
  const [vista, setVista] = useState('lista'); 
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
    setModalData(prev => ({ ...prev, index: (prev.index + 1) % prev.fotos.length }));
  };

  const prevImagen = (e) => {
    e.stopPropagation();
    setModalData(prev => ({ ...prev, index: (prev.index - 1 + prev.fotos.length) % prev.fotos.length }));
  };

  const handleAvistamiento = (pet) => {
    toast.custom((t) => (
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 p-6 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 min-w-[340px] animate-in slide-in-from-top-4 duration-500">
        <div className="relative">
          <img src={pet.fotos?.[0] || pet.fotoUrl} className="w-20 h-20 rounded-full object-cover border-4 border-orange-500 shadow-xl" alt="pet" />
          <span className="absolute -bottom-1 -right-1 text-2xl animate-bounce">📍</span>
        </div>
        <div className="text-center">
          <h3 className="font-black text-[14px] text-slate-900 uppercase tracking-tighter">¿Viste a {pet.nombre}?</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 leading-tight">Compartiremos tu ubicación con el dueño.</p>
        </div>
        <div className="flex gap-2 w-full">
          <button onClick={() => toast.dismiss(t)} className="flex-1 bg-slate-100 text-slate-500 text-[10px] font-black py-4 rounded-2xl uppercase hover:bg-slate-200 transition-all">Cancelar</button>
          <button onClick={() => { toast.dismiss(t); procesarEnvioUbicacion(pet); }} className="flex-1 bg-orange-600 text-white text-[10px] font-black py-4 rounded-2xl uppercase shadow-lg shadow-orange-200 hover:bg-orange-700">SÍ, ENVIAR</button>
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
          const mensajeCompleto = `${mensajeBase} Estoy aquí: ${mapaUrl}`;
          toast.success(`UBICACIÓN ENVIADA`);
          window.open(`https://wa.me/${pet.contacto?.telefono || pet.telefono}?text=${encodeURIComponent(mensajeCompleto)}`, '_blank');
        },
        () => {
          toast.error("GPS desactivado");
          window.open(`https://wa.me/${pet.contacto?.telefono || pet.telefono}?text=${encodeURIComponent(mensajeBase)}`, '_blank');
        }
      );
    } else {
      window.open(`https://wa.me/${pet.contacto?.telefono || pet.telefono}?text=${encodeURIComponent(mensajeBase)}`, '_blank');
    }
  };

  const mascotasFiltradas = mascotas.filter(m => {
    const coincideTipo = filtro === 'Todos' || m.tipo === filtro;
    const coincideBusqueda = 
      m.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.comuna?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideTipo && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-[#fcfaf7] max-w-7xl mx-auto px-4 pb-32 font-sans text-slate-900 overflow-x-hidden">
      
      {/* 1. HERO SECTION REDISEÑADA */}
      <div className="relative bg-slate-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-24 mb-12 overflow-hidden shadow-2xl mt-4">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent skew-x-12 translate-x-32 pointer-events-none"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6 inline-block">Talagante Conectado</span>
            <h1 className="text-4xl md:text-8xl font-black mb-6 leading-[0.9] text-white tracking-tighter uppercase italic">
              Vuelven <br/> <span className="text-orange-500 not-italic">a casa.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-xl font-medium mb-10 max-w-sm mx-auto md:mx-0 leading-tight uppercase">La mayor red de rescate animal de la provincia.</p>
            
            <div className="flex justify-center md:justify-start gap-4">
               <div className="bg-white/5 border border-white/10 p-5 rounded-[2.5rem] backdrop-blur-md">
                  <p className="text-3xl md:text-5xl font-black text-white">{mascotas.length}</p>
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-1">Reportes</p>
               </div>
               <div className="bg-white/5 border border-white/10 p-5 rounded-[2.5rem] backdrop-blur-md">
                  <p className="text-3xl md:text-5xl font-black text-orange-500">24/7</p>
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-1">Activos</p>
               </div>
            </div>
          </div>
          
          <div className="hidden md:flex justify-center items-center relative">
            <div className="absolute w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <span className="text-[14rem] drop-shadow-2xl animate-bounce-slow">🐕</span>
            <span className="text-[10rem] -ml-20 mb-10 drop-shadow-2xl">🐈</span>
          </div>
        </div>
      </div>

      {/* 2. FILTROS Y BUSQUEDA */}
      <div className="flex flex-col gap-8 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
              <span className="w-4 h-10 bg-orange-600 rounded-full"></span>Mascotas
            </h2>
            <div className="flex bg-slate-200/50 p-1.5 rounded-[1.5rem]">
              <button onClick={() => setVista('lista')} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${vista === 'lista' ? 'bg-white shadow-xl text-orange-600' : 'text-slate-500'}`}>Lista</button>
              <button onClick={() => setVista('mapa')} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${vista === 'mapa' ? 'bg-white shadow-xl text-orange-600' : 'text-slate-500'}`}>Mapa 📍</button>
            </div>
          </div>
          
          <div className="relative w-full md:w-96">
            <input type="text" placeholder="BUSCAR POR NOMBRE O COMUNA..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-4 px-12 outline-none font-black text-slate-700 shadow-xl focus:border-orange-500 transition-all text-xs tracking-widest uppercase" />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {['Todos', 'Perro', 'Gato', 'Ave', 'Otro'].map((cat) => (
              <button key={cat} onClick={() => setFiltro(cat)}
                className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${filtro === cat ? 'bg-slate-900 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GRID DE TARJETAS REDISEÑADO */}
      {vista === 'lista' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mascotasFiltradas.length > 0 ? (
            mascotasFiltradas.map((pet) => (
              <div key={pet._id} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="relative h-64 overflow-hidden cursor-zoom-in" onClick={() => setModalData({ isOpen: true, fotos: pet.fotos || [pet.fotoUrl], index: 0 })}>
                  <img src={pet.fotos?.[0] || pet.fotoUrl} alt={pet.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute top-5 left-5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase text-white shadow-xl backdrop-blur-md ${pet.categoria === 'Perdida' ? 'bg-red-500/90' : 'bg-orange-500/90'}`}>
                    {pet.categoria}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{pet.nombre}</h3>
                    <button onClick={() => setPerfilSeleccionado(pet.usuario)} className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center bg-slate-50 hover:bg-orange-500 hover:text-white transition-all">👤</button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">📍 {pet.comuna}</span>
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{getIcono(pet.tipo)} {pet.tipo}</span>
                  </div>

                  <div className="space-y-3">
                    {pet.categoria === 'Perdida' && (
                      <button onClick={() => handleAvistamiento(pet)} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-100 hover:bg-slate-900 transition-all">
                        📍 ¡LO VI RECIÉN!
                      </button>
                    )}
                    <a href={`https://wa.me/${pet.contacto?.telefono || pet.telefono}`} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center w-full py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                      CONTACTAR
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
              <span className="text-7xl block mb-6">🔎</span>
              <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No encontramos huellas que coincidan</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white bg-white">
          <MapaComunidad mascotas={mascotasFiltradas} />
        </div>
      )}

      {/* LOS MODALES (PERFIL Y CARRUSEL) SE MANTIENEN IGUAL QUE TU LÓGICA ORIGINAL PERO CON DISEÑO REFINADO */}
      {perfilSeleccionado && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in" onClick={() => setPerfilSeleccionado(null)}>
          <div className="bg-white rounded-[4rem] p-12 shadow-2xl max-w-md w-full relative text-center" onClick={e => e.stopPropagation()}>
            <div className="w-32 h-32 rounded-full border-8 border-orange-500 shadow-2xl overflow-hidden mx-auto mb-6">
              <img src={perfilSeleccionado.fotoPerfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover" alt="p" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">{perfilSeleccionado.nombre}</h2>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
               <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase">Puntos: {perfilSeleccionado.reputacion}</span>
               <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase">Alertas: {perfilSeleccionado.mascotasReportadas}</span>
            </div>
            <button onClick={() => setPerfilSeleccionado(null)} className="w-full py-4 bg-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500">Cerrar</button>
          </div>
        </div>
      )}

      {/* MODAL CARRUSEL */}
      {modalData.isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/95 backdrop-blur-2xl p-4 md:p-10" onClick={() => setModalData({ ...modalData, isOpen: false })}>
          <div className="relative max-w-5xl w-full h-full flex flex-col justify-center items-center gap-8" onClick={e => e.stopPropagation()}>
            <img src={modalData.fotos[modalData.index]} className="max-h-[80vh] w-auto rounded-[3rem] shadow-2xl border-4 border-white/10 object-contain" alt="v" />
            <div className="flex gap-4">
              <button onClick={prevImagen} className="w-16 h-16 rounded-full bg-white/10 text-white text-2xl hover:bg-orange-500 transition-all">❮</button>
              <button onClick={nextImagen} className="w-16 h-16 rounded-full bg-white/10 text-white text-2xl hover:bg-orange-600 transition-all">❯</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(-5%); } 50% { transform: translateY(0); } }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
}

export default Home;