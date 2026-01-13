import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
// --- NUEVA IMPORTACIÓN ---
import { toast } from 'sonner';
// -------------------------

function VerificarCorreo() {
    const { token } = useParams();
    const [status, setStatus] = useState('verificando'); 
    const navigate = useNavigate();
    const tieneEfectoEjecutado = useRef(false);

    useEffect(() => {
        if (tieneEfectoEjecutado.current) return;
        tieneEfectoEjecutado.current = true;

        const confirmar = async () => {
            // Alerta de proceso sutil
            const loadingToast = toast.loading("REVISANDO CREDENCIALES...");

            try {
                const res = await api.get(`/auth/verificar/${token}`);
                toast.dismiss(loadingToast);
                
                // ÉXITO
                toast.success("CUENTA ACTIVADA", {
                    description: "Ya puedes ingresar a la comunidad.",
                    icon: '🌟'
                });
                
                setStatus('exito');
                setTimeout(() => navigate('/login'), 4000);
            } catch (error) {
                toast.dismiss(loadingToast);
                
                // ERROR
                toast.error("FALLO DE ACTIVACIÓN", {
                    description: "El enlace es inválido o ha expirado.",
                    icon: '❌'
                });
                
                setStatus('error');
            }
        };

        if (token) {
            confirmar();
        } else {
            setStatus('error');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
            {/* TEXTURA DE FONDO */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paws.png')` }}></div>

            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl text-center border border-slate-100 relative z-10 animate-in zoom-in-95 duration-500">
                {status === 'verificando' && (
                    <div className="animate-pulse">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">⚙️</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Validando tu cuenta</h2>
                        <p className="text-slate-400 mt-2 font-bold text-xs uppercase italic tracking-widest">Conectando con TalaHuellas...</p>
                    </div>
                )}

                {status === 'exito' && (
                    <div className="animate-fade-in">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <span className="text-5xl drop-shadow-xl">✅</span>
                        </div>
                        <h2 className="text-3xl font-black text-emerald-600 uppercase tracking-tighter leading-none">¡Excelente!</h2>
                        <p className="text-slate-500 font-bold mt-4 text-sm uppercase tracking-tight leading-relaxed">
                            Tu correo ha sido verificado <br/> correctamente.
                        </p>
                        <div className="mt-8 h-1 w-24 bg-emerald-500 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-emerald-200 w-full animate-shimmer"></div>
                        </div>
                        <p className="text-slate-400 text-[10px] mt-6 uppercase font-black tracking-[0.3em]">Serás redirigido al login...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-fade-in">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl text-red-500">❌</span>
                        </div>
                        <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter">Fallo de Enlace</h2>
                        <p className="text-slate-500 font-bold mt-4 text-sm leading-relaxed uppercase tracking-tighter">
                            El enlace no es válido, ya fue usado <br/> o ha expirado por seguridad.
                        </p>
                        <div className="flex flex-col gap-3 mt-8 pt-8 border-t border-slate-50">
                            <button onClick={() => navigate('/login')} 
                                className="bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 transition-all shadow-lg active:scale-95">
                                Volver al Inicio
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerificarCorreo;