import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
// --- NUEVA IMPORTACIÓN ---
import { toast } from 'sonner';
// -------------------------

function ResetPassword() {
    const { token } = useParams();
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación minimalista con Sonner
        if (nuevaPassword !== confirmarPassword) {
            toast.error("ERROR DE COINCIDENCIA", {
                description: "Las contraseñas ingresadas no son iguales.",
                icon: '🔑'
            });
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("ACTUALIZANDO CREDENCIALES...");

        try {
            await api.post(`/auth/reset-password/${token}`, { nuevaPassword });
            toast.dismiss(loadingToast);
            
            toast.success("CONTRASEÑA ACTUALIZADA", {
                description: "Ya puedes ingresar con tu nueva clave.",
                icon: '✅'
            });

            // Pequeño delay para que el usuario vea el éxito antes de redirigir
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("ERROR", {
                description: error.response?.data?.mensaje || "Token inválido o expirado",
                icon: '⚠️'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">
            {/* TEXTURA DE HUELLITAS */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paws.png')` }}></div>

            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-4xl">🔐</span>
                </div>
                
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2">Nueva Contraseña</h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-8">Seguridad TalaHuellas</p>
                
                <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                    Por favor, ingresa tu nueva clave de acceso y confírmala para asegurar tu cuenta.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Nueva Clave</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="••••••••"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-slate-700 shadow-sm transition-all"
                            onChange={(e) => setNuevaPassword(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Confirmar Clave</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="••••••••"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-slate-700 shadow-sm transition-all"
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Sincronizando...' : 'Restablecer Ahora'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;