import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import api from './api/axios';
import Home from './pages/Home';
import Publicar from './pages/Publicar';
import Marketplace from './pages/Marketplace';
import PublicarProducto from './pages/PublicarProducto';
import Admin from './pages/Admin';
import Login from './pages/Login';
import MisPublicaciones from './pages/MisPublicaciones';

import VerificarCorreo from './pages/VerificarCorreo';
import OlvidePassword from './pages/OlvidePassword';
import ResetPassword from './pages/ResetPassword';

// --- NUEVAS IMPORTACIONES PARA ALERTAS Y FIREBASE ---
import { Toaster, toast } from 'sonner';
import { solicitarPermisos, alRecibirMensaje } from './firebase'; 
// ------------------------------------------

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`text-[11px] font-black transition-all uppercase tracking-[0.2em] relative group ${
        isActive ? 'text-orange-600' : 'text-slate-500 hover:text-orange-600'
      }`}
    >
      {children}
      <span className={`absolute -bottom-2 left-0 h-[2px] bg-orange-500 transition-all duration-500 ${
        isActive ? 'w-full' : 'w-0 group-hover:w-full'
      }`}></span>
    </Link>
  );
}

function App() {
  const [totalMascotas, setTotalMascotas] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [chatAbierto, setChatAbierto] = useState(false);
  const location = useLocation();

  const obtenerConteo = async () => {
    try {
      const res = await api.get('/mascotas');
      setTotalMascotas(res.data.length);
    } catch (error) {
      console.error("Error al obtener conteo:", error);
    }
  };

  // --- EFECTO PARA INICIALIZAR USUARIO Y CONTEO ---
  useEffect(() => {
    const userGuardado = localStorage.getItem('usuarioTala');
    if (userGuardado) {
      setUsuario(JSON.parse(userGuardado));
    }
    obtenerConteo();
    const interval = setInterval(obtenerConteo, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- NUEVO EFECTO: GESTIÓN DE NOTIFICACIONES PUSH ---
  useEffect(() => {
    const activarNotificaciones = async () => {
      // 1. Pedimos el token a Firebase
      const token = await solicitarPermisos();
      const userGuardado = localStorage.getItem('usuarioTala');
      
      // 2. Si tenemos token y el usuario está logueado, lo guardamos en la DB
      if (token && userGuardado) {
        const user = JSON.parse(userGuardado);
        try {
          await api.post('/auth/registrar-token', { 
            userId: user.id || user._id, 
            token: token 
          });
          console.log("🔔 Notificaciones sincronizadas");
        } catch (err) {
          console.error("Error al vincular token con el servidor", err);
        }
      }
    };

    activarNotificaciones();

    // 3. Escuchar mensajes cuando la app está abierta (Primer Plano)
    const unsubscribe = alRecibirMensaje((payload) => {
      toast.info(payload.notification.title, {
        description: payload.notification.body,
        icon: '🔔',
        duration: 8000,
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [usuario]); // Se re-ejecuta si el usuario cambia (ej: al hacer login)

  // --- LOGOUT MEJORADO CON ALERTA MINIMALISTA ---
  const handleLogout = () => {
    toast.custom((t) => (
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 text-center">
        <span className="text-2xl">🚪</span>
        <div>
          <h3 className="font-black text-[12px] text-slate-900 uppercase tracking-widest">¿Cerrar sesión?</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Deberás ingresar tus datos de nuevo</p>
        </div>
        <div className="flex gap-2 w-full">
          <button 
            onClick={() => toast.dismiss(t)}
            className="flex-1 bg-slate-100 text-slate-600 text-[9px] font-black py-3 rounded-2xl uppercase tracking-tighter"
          >
            Volver
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('usuarioTala');
              setUsuario(null);
              window.location.href = "/";
            }}
            className="flex-1 bg-orange-600 text-white text-[9px] font-black py-3 rounded-2xl uppercase tracking-tighter shadow-lg shadow-orange-200"
          >
            Sí, salir
          </button>
        </div>
      </div>
    ), { duration: 10000, position: 'top-center' });
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] font-sans flex flex-col pb-24 md:pb-0">
      
      {/* CONFIGURACIÓN DEL CONTENEDOR DE ALERTAS */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: { borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' },
        }}
      />

      {/* HEADER RESPONSIVE */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-2 md:gap-4 group">
            <div className="w-10 h-10 md:w-16 md:h-16 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-orange-100 rounded-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500"></div>
              <img 
                src="https://i.postimg.cc/C5vpkC30/Copilot-20260110-194421.png" 
                alt="Logo" 
                className="w-8 h-8 md:w-12 md:h-12 object-contain relative z-10"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-lg font-black text-slate-900 tracking-tighter leading-none uppercase">TalaHuellas</span>
              <span className="text-[7px] md:text-[9px] font-bold text-orange-500 uppercase tracking-[0.2em] mt-1 hidden sm:block">Talagante y alrededores</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-8 border-r border-slate-100 pr-8">
              <NavLink to="/">Inicio</NavLink>
              <NavLink to="/tienda">Tienda</NavLink>
              {usuario && <NavLink to="/mis-publicaciones">Mis Huellas</NavLink>}
              
              {usuario && usuario.role === 'admin' && (
                <Link 
                  to="/admin-tala" 
                  className="bg-slate-900 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg"
                >
                  Admin 🛡️
                </Link>
              )}
            </div>

            <div className="flex items-center gap-5">
              <button onClick={obtenerConteo} className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors group">
                <span className="text-xl group-hover:scale-110 transition-transform block">🐾</span>
                {totalMascotas > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-orange-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">{totalMascotas}</span>
                )}
              </button>

              <div className="flex gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-100">
                <Link to="/publicar" className="bg-white text-slate-800 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-sm">Reportar</Link>
                <Link to="/vender" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md">Vender</Link>
              </div>

              {usuario ? (
                <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-full border border-slate-100 pr-4 shadow-sm group">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                    <img src={usuario.fotoPerfil || "https://i.postimg.cc/C5vpkC30/Copilot-20260110-194421.png"} alt="perfil" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter leading-none">{usuario.nombre.split(' ')[0]}</span>
                    <button onClick={handleLogout} className="text-[8px] font-black text-orange-500 uppercase tracking-widest hover:text-red-500 transition-colors text-left">Salir</button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all">👤</Link>
              )}
            </div>
          </nav>

          <div className="lg:hidden flex items-center gap-3">
            {usuario && usuario.role === 'admin' && (
              <Link to="/admin-tala" className="bg-slate-900 text-white w-9 h-9 flex items-center justify-center rounded-xl text-xs shadow-lg">🛡️</Link>
            )}
            <button onClick={obtenerConteo} className="relative text-lg p-2 bg-slate-50 rounded-xl border border-slate-100">
              🐾
              {totalMascotas > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
            </button>
            <Link to={usuario ? "/mis-publicaciones" : "/login"} className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200">
                <img src={usuario?.fotoPerfil || "https://i.postimg.cc/C5vpkC30/Copilot-20260110-194421.png"} alt="u" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} />
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE BAR */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 h-16 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-[2rem] flex justify-around items-center z-[110] shadow-2xl px-2">
        <Link to="/" className={`p-3 rounded-2xl transition-all ${location.pathname === '/' ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30' : 'text-slate-400'}`}>
          <span className="text-xl">🏠</span>
        </Link>
        <Link to="/tienda" className={`p-3 rounded-2xl transition-all ${location.pathname === '/tienda' ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30' : 'text-slate-400'}`}>
          <span className="text-xl">🛍️</span>
        </Link>
        
        <div className="relative">
          <Link to="/publicar" className="bg-white text-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl -mt-10 border-4 border-[#fcfaf7] active:scale-90 transition-all font-light">
            <span className="text-2xl">＋</span>
          </Link>
        </div>

        <Link to="/mis-publicaciones" className={`p-3 rounded-2xl transition-all ${location.pathname === '/mis-publicaciones' ? 'bg-slate-700 text-white scale-110 shadow-lg' : 'text-slate-400'}`}>
          <span className="text-xl">📋</span>
        </Link>

        {usuario ? (
          <button onClick={handleLogout} className="p-3 text-red-400"><span className="text-xl">🚪</span></button>
        ) : (
          <Link to="/login" className="p-3 text-orange-400 font-black text-[10px] uppercase">Login</Link>
        )}
      </div>

      {/* WHATSAPP FLOTANTE */}
      <a 
        href="https://wa.me/56977922875" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-24 md:bottom-10 right-4 md:right-8 z-[120] bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all group"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* CHATBOT */}
      <div className="hidden lg:block">
        {!chatAbierto ? (
          <button onClick={() => setChatAbierto(true)} className="fixed bottom-10 left-8 z-[120] bg-slate-900 text-white px-6 py-4 rounded-[2rem] flex items-center gap-3 shadow-2xl hover:bg-orange-600 transition-all font-black text-[10px] uppercase tracking-widest border border-white/10">🤖 Ayuda Tala</button>
        ) : (
          <div className="fixed bottom-10 left-8 z-[130] w-80 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <span className="font-black text-[10px] uppercase tracking-widest">Soporte TalaHuellas</span>
              <button onClick={() => setChatAbierto(false)}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl italic text-[11px]">"Hola, ¿cómo podemos ayudarte hoy?"</div>
              <a href="https://wa.me/56977922875?text=Hola, tengo un problema con un reporte" target="_blank" rel="noreferrer" className="block w-full text-center p-3 bg-orange-50 text-orange-600 rounded-xl font-black text-[10px] uppercase">Problemas con Reporte</a>
            </div>
          </div>
        )}
      </div>

      <main className="flex-grow animate-in fade-in duration-1000 overflow-x-hidden">
        <div className="py-4 md:py-10">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/publicar" element={<Publicar />} />
            <Route path="/tienda" element={<Marketplace />} />
            <Route path="/vender" element={<PublicarProducto />} />
            <Route path="/admin-tala" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mis-publicaciones" element={<MisPublicaciones />} />
            <Route path="/verificar-correo/:token" element={<VerificarCorreo />} />
            <Route path="/olvide-password" element={<OlvidePassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 pt-10 md:pt-20 pb-10 mt-auto hidden sm:block">
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 md:mb-20 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-4">
              <img src="https://i.postimg.cc/C5vpkC30/Copilot-20260110-194421.png" alt="Logo" className="h-16 md:h-20 grayscale opacity-50" />
              <p className="text-slate-400 font-medium text-xs leading-relaxed uppercase tracking-wider">Infraestructura digital para la <br /> comunidad animal de Talagante.</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Directorio</h4>
              <Link to="/" className="text-xs font-black text-slate-900 uppercase hover:text-orange-600">Comunidad</Link>
              <Link to="/tienda" className="text-xs font-black text-slate-900 uppercase hover:text-emerald-600">Tienda</Link>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Ayuda</h4>
              <a href="https://wa.me/56977922875" className="text-xs font-black text-slate-900 uppercase hover:text-orange-600">WhatsApp Soporte</a>
            </div>
            <div className="flex flex-col items-center md:items-start gap-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Conéctate</h4>
              <Link to="/publicar" className="w-full py-3 border-2 border-slate-900 text-slate-900 text-center rounded-2xl text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-100">Crear Alerta 🚀</Link>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-[8px] md:text-[9px] font-black tracking-[0.3em] uppercase italic">© 2026 Realizado por Alexis Tobar con amor</p>
            <p className="text-slate-400 text-[8px] md:text-[9px] font-black tracking-[0.3em] uppercase">Talagante • Peñaflor • Isla de Maipo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}