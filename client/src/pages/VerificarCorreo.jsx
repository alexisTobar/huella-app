import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function VerificarCorreo() {
    const { token } = useParams();
    const [status, setStatus] = useState('verificando'); 
    const navigate = useNavigate();
    // useRef evita que el useEffect se ejecute dos veces en React 18 (Strict Mode)
    const tieneEfectoEjecutado = useRef(false);

    useEffect(() => {
        if (tieneEfectoEjecutado.current) return;
        tieneEfectoEjecutado.current = true;

        const confirmar = async () => {
            try {
                console.log("Enviando token al servidor:", token);
                // IMPORTANTE: Asegúrate que esta ruta coincida con tu backend
                const res = await api.get(`/auth/verificar/${token}`);
                console.log("Respuesta servidor:", res.data);
                
                setStatus('exito');
                // Redirigir después de un momento para que el usuario lea el mensaje
                setTimeout(() => navigate('/login'), 4000);
            } catch (error) {
                console.error("Error capturado:", error.response?.data || error.message);
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl text-center border border-slate-100">
                {status === 'verificando' && (
                    <div className="animate-pulse">
                        <div className="text-6xl mb-6">⚙️</div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Validando tu cuenta</h2>
                        <p className="text-slate-400 mt-2 font-bold text-xs uppercase italic">Conectando con TalaHuellas...</p>
                    </div>
                )}

                {status === 'exito' && (
                    <div className="animate-fade-in">
                        <div className="text-6xl mb-6 shadow-emerald-100 drop-shadow-xl">✅</div>
                        <h2 className="text-3xl font-black text-emerald-600 uppercase tracking-tighter leading-none">¡Excelente!</h2>
                        <p className="text-slate-500 font-bold mt-4 text-sm">Tu correo ha sido verificado.</p>
                        <div className="mt-6 h-1 w-24 bg-emerald-500 rounded-full mx-auto animate-shimmer"></div>
                        <p className="text-slate-400 text-[10px] mt-4 uppercase font-black tracking-widest">Serás redirigido al login...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-fade-in">
                        <div className="text-6xl mb-6">❌</div>
                        <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter">Error de Verificación</h2>
                        <p className="text-slate-500 font-bold mt-4 text-sm leading-relaxed">
                            El enlace no es válido, ya fue usado o ha expirado por seguridad.
                        </p>
                        <div className="flex flex-col gap-3 mt-8">
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