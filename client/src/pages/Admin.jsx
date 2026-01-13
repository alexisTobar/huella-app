import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
// --- NUEVA IMPORTACIÓN ---
import { toast } from 'sonner';
// -------------------------

function Admin() {
  const [mascotas, setMascotas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tab, setTab] = useState('dashboard');
  const [autorizado, setAutorizado] = useState(false); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const PASSWORD_SECRETA = "tala2024"; 

  useEffect(() => {
    const userGuardado = localStorage.getItem('usuarioTala');
    if (userGuardado) {
      const user = JSON.parse(userGuardado);
      if (user.role === 'admin') {
        setAutorizado(true);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (autorizado) {
      fetchData();
    }
  }, [autorizado]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resM, resP, resU] = await Promise.all([
        api.get('/mascotas'),
        api.get('/productos'),
        api.get('/auth/usuarios')
      ]);
      setMascotas(Array.isArray(resM.data) ? resM.data : []);
      setProductos(Array.isArray(resP.data) ? resP.data : []);
      setUsuarios(Array.isArray(resU.data) ? resU.data : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al sincronizar datos");
    } finally {
      setLoading(false);
    }
  };

  const renderDatoSeguro = (dato) => {
    if (!dato) return 'N/A';
    if (typeof dato === 'object') {
      return dato.telefono || dato.whatsapp || dato.email || JSON.stringify(dato);
    }
    return dato;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === PASSWORD_SECRETA) {
      setAutorizado(true);
      toast.success("ACCESO CONCEDIDO", { icon: '🔑' });
    } else {
      toast.error("CLAVE INCORRECTA", { description: "Verifica tus credenciales de administrador." });
    }
  };

  // --- ELIMINAR ITEM CON ALERTA MINIMALISTA ADAPTADA A DARK MODE ---
  const eliminarItem = (id, tipo) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 text-center min-w-[320px]">
        <span className="text-3xl">⚠️</span>
        <div>
          <h3 className="font-black text-[12px] text-slate-900 dark:text-white uppercase tracking-widest">¿Confirmar eliminación?</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">Esta acción es permanente y afectará a la base de datos.</p>
        </div>
        <div className="flex gap-2 w-full">
          <button onClick={() => toast.dismiss(t)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-black py-3 rounded-2xl uppercase">Cancelar</button>
          <button 
            onClick={async () => {
              toast.dismiss(t);
              const rutaBase = tipo === 'mascotas' ? 'mascotas' : tipo === 'productos' ? 'productos' : 'auth/usuarios';
              const loadingToast = toast.loading("ELIMINANDO...");
              try {
                await api.delete(`${rutaBase}/${id}`);
                toast.dismiss(loadingToast);
                toast.success("REGISTRO ELIMINADO");
                fetchData();
              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Error al eliminar");
              }
            }}
            className="flex-1 bg-red-600 text-white text-[9px] font-black py-3 rounded-2xl uppercase shadow-lg shadow-red-100 dark:shadow-none"
          >
            SÍ, ELIMINAR
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  // --- CAMBIAR ROL CON ALERTA MINIMALISTA ---
  const cambiarRolUsuario = (id, rolActual) => {
    const nuevoRol = rolActual === 'admin' ? 'user' : 'admin';
    
    toast.custom((t) => (
      <div className="bg-slate-900 dark:bg-black text-white p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 text-center min-w-[320px] border border-white/10">
        <span className="text-3xl">🛡️</span>
        <div>
          <h3 className="font-black text-[12px] uppercase tracking-widest">¿Modificar Rango?</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            {nuevoRol === 'admin' ? "Darás acceso total a este usuario." : "Quitarás los permisos de administración."}
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <button onClick={() => toast.dismiss(t)} className="flex-1 bg-white/10 text-white text-[9px] font-black py-3 rounded-2xl uppercase">Volver</button>
          <button 
            onClick={async () => {
              toast.dismiss(t);
              const loadToast = toast.loading("ACTUALIZANDO...");
              try {
                await api.patch(`/auth/usuarios/rol/${id}`, { nuevoRol });
                toast.dismiss(loadToast);
                toast.success("RANGO ACTUALIZADO");
                fetchData(); 
              } catch (error) {
                toast.dismiss(loadToast);
                toast.error("Error al cambiar rol");
              }
            }}
            className="flex-1 bg-orange-500 text-white text-[9px] font-black py-3 rounded-2xl uppercase shadow-lg shadow-orange-500/20"
          >
            ACEPTAR
          </button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:scale-[1.02] transition-all">
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">{title}</p>
        <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{value}</h3>
      </div>
      <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
        {icon}
      </div>
    </div>
  );

  if (!autorizado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7] dark:bg-slate-950 px-4 transition-colors">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-md text-center">
          <div className="w-24 h-24 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">🔑</div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-2">Security</h2>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mb-8">Consola de Administración</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Clave Maestra"
              className="w-full px-8 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-orange-500 outline-none text-center font-black text-xl"
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="w-full py-5 rounded-3xl bg-slate-900 dark:bg-orange-600 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-orange-600 dark:hover:bg-orange-500 transition-all active:scale-95">
              Desbloquear Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in pb-32 dark:text-white transition-colors">
      <div className="bg-slate-900 dark:bg-black rounded-[4rem] p-10 md:p-16 mb-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">TalaHuellas <span className="text-orange-500 text-2xl">OS</span></h1>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Sistema de Gestión Integral Provincia del Maipo</p>
          </div>
          <div className="flex bg-white/5 backdrop-blur-md p-2 rounded-[2.5rem] border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'mascotas', label: 'Reportes', icon: '🐾' },
              { id: 'productos', label: 'Tienda', icon: '🛍️' },
              { id: 'usuarios', label: 'Usuarios', icon: '👥' }
            ].map((t) => (
              <button 
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${tab === t.id ? 'bg-orange-500 text-white shadow-xl' : 'text-slate-400 dark:text-slate-500 hover:text-white'}`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-40 text-center animate-pulse">
            <div className="text-6xl mb-4">🛸</div>
            <p className="font-black uppercase tracking-widest text-slate-400">Sincronizando con el servidor...</p>
        </div>
      ) : (
        <>
          {tab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
              <StatCard title="Alertas de Mascotas" value={mascotas.length} icon="🐾" color="bg-orange-100 dark:bg-orange-500/20 text-orange-600" />
              <StatCard title="Productos en Tienda" value={productos.length} icon="🛒" color="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600" />
              <StatCard title="Usuarios Registrados" value={usuarios.length} icon="👥" color="bg-blue-100 dark:bg-blue-500/20 text-blue-600" />
              
              <div className="md:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[4rem] shadow-xl border border-slate-100 dark:border-slate-800">
                <h3 className="font-black uppercase text-slate-800 dark:text-white tracking-widest text-sm mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-orange-500 rounded-full"></span> 
                  Distribución de Actividad
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                      <span className="text-slate-400 dark:text-slate-500">Reportes de Comunidad</span>
                      <span className="text-slate-800 dark:text-white">{Math.round((mascotas.length / (mascotas.length + productos.length + 1)) * 100)}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${(mascotas.length / (mascotas.length + productos.length + 1)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                      <span className="text-slate-400 dark:text-slate-500">Marketplace / Tienda</span>
                      <span className="text-slate-800 dark:text-white">{Math.round((productos.length / (mascotas.length + productos.length + 1)) * 100)}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(productos.length / (mascotas.length + productos.length + 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 dark:bg-black p-10 rounded-[4rem] text-white shadow-2xl flex flex-col justify-center text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-4">Estado del Servidor</p>
                <div className="text-5xl mb-4">📡</div>
                <h4 className="text-2xl font-black uppercase tracking-tighter">Sistema Online</h4>
                <p className="text-slate-500 text-xs font-bold mt-2 italic">Protegiendo huellas en Talagante 24/7</p>
              </div>
            </div>
          )}

          {tab !== 'dashboard' && (
            <div className="bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-8 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Información Principal</th>
                      <th className="p-8 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Detalle / Contacto</th>
                      <th className="p-8 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Categoría / Estado</th>
                      <th className="p-8 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {(tab === 'mascotas' ? mascotas : tab === 'productos' ? productos : usuarios).map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                        <td className="p-8">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-700">
                              <img 
                                src={item.fotoPerfil || item.fotoUrl || (item.fotos && item.fotos[0]) || 'https://i.postimg.cc/C5vpkC30/Copilot-20260110-194421.png'} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                alt="thumb" 
                                onError={(e) => { e.target.src = 'https://i.postimg.cc/C5vpkC30/Copilot-20260110-194421.png' }}
                              />
                            </div>
                            <div>
                              <p className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-tight">{item.nombre || item.titulo || 'Sin nombre'}</p>
                              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">{item._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{renderDatoSeguro(item.email || item.whatsappVendedor || item.contacto)}</span>
                            <span className="text-[10px] font-black text-orange-500 uppercase italic">{renderDatoSeguro(item.telefono || 'Talagante, CL')}</span>
                          </div>
                        </td>
                        <td className="p-8">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${item.role === 'admin' ? 'bg-slate-900 dark:bg-orange-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                            {item.categoria || item.role || (item.isVerified ? 'Verificado' : 'Pendiente')}
                          </span>
                        </td>
                        <td className="p-8 text-right">
                          <div className="flex gap-2 justify-end">
                            {tab === 'usuarios' && (
                              <button 
                                onClick={() => cambiarRolUsuario(item._id, item.role)}
                                className={`px-4 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-sm active:scale-95 transition-all ${
                                  item.role === 'admin' 
                                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 hover:bg-amber-600 hover:text-white' 
                                  : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white'
                                }`}
                              >
                                {item.role === 'admin' ? '✪ Quitar Admin' : '＋ Hacer Admin'}
                              </button>
                            )}

                            <button 
                              onClick={() => eliminarItem(item._id, tab)}
                              className="bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-2xl transition-all font-black text-[9px] uppercase tracking-widest shadow-sm active:scale-95"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {(tab === 'mascotas' ? mascotas : tab === 'productos' ? productos : usuarios).length === 0 && (
                <div className="py-32 text-center">
                  <p className="font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest text-xs">Sin registros en esta categoría</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;