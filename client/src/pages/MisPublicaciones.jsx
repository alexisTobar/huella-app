import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function MisPublicaciones() {
  const [mascotas, setMascotas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userJson = localStorage.getItem('usuarioTala');
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const userId = user.id || user._id;
      const [resMascotas, resProductos] = await Promise.all([
        api.get(`/mascotas/usuario/${userId}`).catch(() => ({ data: [] })),
        api.get(`/productos/usuario/${userId}`).catch(() => ({ data: [] }))
      ]);
      
      setMascotas(resMascotas.data);
      setProductos(resProductos.data);
    } catch (error) {
      console.error("Error cargando tus datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarMascota = async (id) => {
    if (window.confirm("¿Ya encontraste a tu mascota o quieres borrar el reporte?")) {
      try {
        await api.delete(`/mascotas/${id}`);
        setMascotas(mascotas.filter(m => m._id !== id));
        alert("✅ Reporte eliminado");
      } catch (error) {
        alert("❌ Error al eliminar");
      }
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Deseas eliminar este producto permanentemente?")) {
      try {
        await api.delete(`/productos/${id}`);
        setProductos(productos.filter(p => p._id !== id));
        alert("✅ Producto eliminado");
      } catch (error) {
        alert("❌ Error al eliminar");
      }
    }
  };

  const toggleEstadoProducto = async (id, estadoActual) => {
    try {
      const nuevoEstado = !estadoActual;
      await api.put(`/productos/${id}`, { vendido: nuevoEstado });
      setProductos(productos.map(p => 
        p._id === id ? { ...p, vendido: nuevoEstado } : p
      ));
    } catch (error) {
      alert("❌ Error al actualizar estado");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center animate-pulse">
        <div className="text-4xl mb-4">🐾</div>
        <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Sincronizando panel...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden font-sans pb-32">
      
      {/* MEJORA: FONDO DIFUMINADO Y TEXTURA */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paws.png')` }}></div>
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-100/20 via-transparent to-emerald-50/20 z-0 blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10">
        
        {/* HEADER DEL PANEL - FULL RESPONSIVE */}
        <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-white mb-10 md:mb-16 relative overflow-hidden shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Foto de perfil de Google o Inicial */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl">
              <img 
                src={user?.fotoPerfil || "https://i.postimg.cc/C5vpkC30/Copilot-20260110-194421.png"} 
                className="w-full h-full object-cover" 
                alt="perfil" 
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-2">
                Hola, <span className="text-orange-500">{user?.nombre.split(' ')[0]}</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">
                Centro de gestión • {mascotas.length + productos.length} publicaciones activas
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN MASCOTAS - Responsive Grid (2 cols móvil) */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-3xl font-black text-slate-800 flex items-center gap-2 md:gap-4 uppercase tracking-tighter">
              <span className="w-2 h-6 md:h-10 bg-orange-500 rounded-full"></span> 
              🐾 Mis Reportes
            </h2>
          </div>
          
          {mascotas.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-[2rem] md:rounded-[3rem] py-16 md:py-20 text-center">
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No has publicado reportes aún</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
              {mascotas.map(m => (
                <div key={m._id} className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-lg overflow-hidden border border-slate-100 flex flex-col group transition-all hover:shadow-2xl">
                  <div className="h-36 md:h-64 overflow-hidden relative">
                    <img src={m.fotos?.[0] || m.fotoUrl} alt={m.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-orange-500 text-white text-[6px] md:text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-lg">
                      {m.categoria}
                    </div>
                  </div>
                  <div className="p-4 md:p-8 flex-grow flex flex-col justify-between">
                    <h3 className="font-black text-sm md:text-2xl text-slate-800 uppercase tracking-tighter mb-4 md:mb-6 truncate">{m.nombre}</h3>
                    <button 
                      onClick={() => eliminarMascota(m._id)}
                      className="w-full py-2.5 md:py-4 bg-red-50 text-red-500 rounded-xl md:rounded-2xl font-black text-[8px] md:text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-100"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECCIÓN PRODUCTOS - Responsive Grid (2 cols móvil) */}
        <section className="pb-10">
          <h2 className="text-xl md:text-3xl font-black text-slate-800 mb-8 flex items-center gap-2 md:gap-4 uppercase tracking-tighter">
            <span className="w-2 h-6 md:h-10 bg-emerald-500 rounded-full"></span> 
            💰 Mis Ventas
          </h2>

          {productos.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-[2rem] md:rounded-[3rem] py-16 md:py-20 text-center">
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No tienes productos en venta</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
              {productos.map(p => (
                <div key={p._id} className={`bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-lg overflow-hidden border border-slate-100 flex flex-col transition-all duration-500 ${p.vendido ? 'opacity-60 grayscale' : 'opacity-100'}`}>
                  <div className="h-36 md:h-64 overflow-hidden relative">
                    <img src={p.fotos?.[0] || p.fotoUrl} alt={p.titulo} className="w-full h-full object-cover" />
                    {p.vendido && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white text-slate-900 px-4 md:px-6 py-1 md:py-2 rounded-full font-black text-[8px] md:text-xs uppercase tracking-[0.2em] -rotate-12 shadow-2xl border-2 md:border-4 border-slate-900">Vendido</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-8 flex-grow space-y-3 md:space-y-4">
                    <h3 className="font-black text-xs md:text-xl text-slate-800 uppercase tracking-tighter truncate">{p.titulo}</h3>
                    
                    <div className="flex flex-col gap-1.5 md:gap-2">
                      <button 
                        onClick={() => toggleEstadoProducto(p._id, p.vendido)}
                        className={`w-full py-2 md:py-3 rounded-lg md:rounded-xl font-black text-[7px] md:text-[9px] uppercase tracking-widest border-2 transition-all ${
                          p.vendido 
                          ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white' 
                          : 'border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {p.vendido ? '🔓 Re-activar' : '🤝 Marcar Vendido'}
                      </button>

                      <button 
                        onClick={() => eliminarProducto(p._id)}
                        className="w-full py-2 md:py-3 bg-red-50 text-red-500 rounded-lg md:rounded-xl font-black text-[7px] md:text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm"
                      >
                        🗑️ Borrar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MisPublicaciones;