import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { GoogleLogin } from '@react-oauth/google';
// --- NUEVA IMPORTACIÓN ---
import { toast } from 'sonner';
// -------------------------

function Login() {
  const [isRegistro, setIsRegistro] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', telefono: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistro ? '/auth/registrar' : '/auth/login';
    
    // Alerta de carga minimalista
    const loadingToast = toast.loading(isRegistro ? "CREANDO CUENTA..." : "INICIANDO SESIÓN...");

    try {
      const res = await api.post(endpoint, {
        ...formData,
        telefono: isRegistro ? `+569${formData.telefono}` : formData.telefono
      });

      toast.dismiss(loadingToast);

      if (!isRegistro) {
        localStorage.setItem('usuarioTala', JSON.stringify(res.data.usuario));
        
        // Alerta de éxito minimalista
        toast.success(`¡HOLA, ${res.data.usuario.nombre.toUpperCase()}!`, {
          description: 'Bienvenido de nuevo a la comunidad.',
          icon: '🐾'
        });

        setTimeout(() => {
          navigate('/');
          window.location.reload(); 
        }, 1500);

      } else {
        // Alerta de registro exitoso
        toast.success("CUENTA CREADA", {
          description: "Revisa tu correo para verificar tu cuenta.",
          duration: 6000,
          icon: '📧'
        });
        setIsRegistro(false);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      // Alerta de error minimalista
      toast.error("UPS, ALGO PASÓ", {
        description: error.response?.data?.mensaje || "Error en la operación",
        icon: '⚠️'
      });
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center relative overflow-hidden bg-slate-50">
      
      {/* MEJORA: FONDO DE ANIMALITOS DIFUMINADO PROFESIONAL */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paws.png')` }}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-200/40 via-transparent to-slate-100/30 z-0 blur-3xl"></div>

      <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[600px] relative z-10">
        
        <div className="md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 relative">
          {/* Decoración lateral */}
          <div className="absolute top-0 right-0 w-full h-full bg-orange-500/5 skew-x-12 translate-x-10 pointer-events-none"></div>
          
          <span className="text-4xl mb-6 relative z-10">{isRegistro ? '👋' : '🔐'}</span>
          <h2 className="text-4xl font-black leading-tight mb-4 tracking-tighter uppercase relative z-10">
            {isRegistro ? 'Crea tu \nCuenta.' : 'Ingreso \nPortal.'}
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed relative z-10">
            {isRegistro ? 'Sé parte de la red de cuidado animal más grande del Maipo.' : 'Bienvenido de vuelta a TalaHuellas.'}
          </p>
          
          <div className="mt-20 pt-8 border-t border-white/10 relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">¿Problemas al entrar?</p>
            <p className="text-sm font-bold mt-2 text-orange-500">+569 77922875</p>
          </div>

          <span className="absolute -bottom-10 -left-10 text-9xl opacity-5 rotate-12 pointer-events-none">🐾</span>
        </div>

        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistro && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nombre</label>
                <input type="text" required className="w-full px-4 bg-slate-50 border-b-2 border-transparent focus:border-orange-500 py-3 outline-none font-bold text-slate-800 transition-all shadow-sm rounded-xl"
                  onChange={e => setFormData({...formData, nombre: e.target.value})} />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
              <input type="email" required className="w-full px-4 bg-slate-50 border-b-2 border-transparent focus:border-orange-500 py-3 outline-none font-bold text-slate-800 transition-all shadow-sm rounded-xl"
                onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contraseña</label>
              <input type="password" required className="w-full px-4 bg-slate-50 border-b-2 border-transparent focus:border-orange-500 py-3 outline-none font-bold text-slate-800 transition-all shadow-sm rounded-xl"
                onChange={e => setFormData({...formData, password: e.target.value})} />
              {!isRegistro && (
                <Link to="/olvide-password" 
                  className="absolute right-0 top-0 text-[9px] font-black uppercase text-orange-500 tracking-widest hover:text-slate-900 transition-colors">
                  ¿Olvido?
                </Link>
              )}
            </div>

            {isRegistro && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">WhatsApp</label>
                <div className="flex items-center gap-2 bg-slate-50 border-b-2 border-transparent focus-within:border-orange-500 px-4 transition-all shadow-sm rounded-xl">
                  <span className="font-black text-slate-400 text-xs">+569</span>
                  <input type="text" maxLength="8" placeholder="12345678" required className="flex-grow bg-transparent py-3 outline-none font-bold text-slate-800"
                    onChange={e => setFormData({...formData, telefono: e.target.value})} />
                </div>
              </div>
            )}

            <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-orange-600 transition-all shadow-xl active:scale-[0.98]">
              {isRegistro ? 'Registrarme' : 'Entrar a la App'}
            </button>
          </form>

          {!isRegistro && (
            <div className="mt-10">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center"><span className="bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Acceso Google</span></div>
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={async (res) => {
                    const loadingGoogle = toast.loading("CONECTANDO CON GOOGLE...");
                    try {
                        const { data } = await api.post('/auth/google', { idToken: res.credential });
                        toast.dismiss(loadingGoogle);
                        localStorage.setItem('usuarioTala', JSON.stringify(data.usuario));
                        
                        toast.success("ACCESO EXITOSO", { icon: '🚀' });
                        
                        setTimeout(() => {
                          navigate('/');
                          window.location.reload();
                        }, 1000);
                    } catch (err) {
                        toast.dismiss(loadingGoogle);
                        toast.error("ERROR GOOGLE", { description: "No pudimos validar tu cuenta." });
                    }
                  }}
                  onError={() => toast.error("LOGIN FALLIDO")}
                  useOneTap
                  theme="outline" shape="pill" size="large" width="100%"
                />
              </div>
            </div>
          )}

          <button onClick={() => setIsRegistro(!isRegistro)}
            className="mt-10 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors w-full text-center active:scale-95">
            {isRegistro ? '¿Ya tienes cuenta? Ingresa' : '¿No tienes cuenta? Crea una'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;