import { useState } from 'react';
import api from '../api/axios';
// --- NUEVA IMPORTACIÓN ---
import { toast } from 'sonner';
// -------------------------

function OlvidePassword() {
    const [email, setEmail] = useState('');
    const [enviado, setEnviado] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Alerta de carga minimalista
        const loadingToast = toast.loading("BUSCANDO TU CUENTA...");

        try {
            await api.post('/auth/olvide-password', { email });
            toast.dismiss(loadingToast);
            
            // ÉXITO
            toast.success("INSTRUCCIONES ENVIADAS", {
                description: "Revisa tu email para restablecer la clave.",
                icon: '📩'
            });
            
            setEnviado(true);
        } catch (error) {
            toast.dismiss(loadingToast);
            
            // ERROR
            toast.error("ERROR", {
                description: error.response?.data?.mensaje || "No se pudo enviar el correo",
                icon: '⚠️'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
            {/* TEXTURA DE FONDO SUTIL */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paws.png')` }}></div>

            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                {!enviado ? (
                    <form onSubmit={handleSubmit} className="space-y-6 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                            <span className="text-4xl">🔑</span>
                        </div>
                        
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">¿Olvidaste tu clave?</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Recuperación de cuenta TalaHuellas</p>
                        </div>

                        <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">
                            Ingresa tu correo y te enviaremos un link para restablecerla de forma segura.
                        </p>

                        <div className="space-y-2 text-left">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Tu Correo Electrónico</label>
                            <input 
                                type="email" 
                                required 
                                placeholder="ejemplo@correo.com"
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-slate-700 transition-all shadow-sm"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'PROCESANDO...' : 'Enviar Instrucciones'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-6 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-bounce">
                            <span className="text-5xl">📧</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">¡Correo Enviado!</h2>
                        <p className="text-slate-500 font-bold mt-4 leading-relaxed uppercase text-[10px] tracking-widest">
                            Revisa tu bandeja de entrada <br/> (y la carpeta de spam)
                        </p>
                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <button 
                                onClick={() => window.location.href = '/login'}
                                className="text-orange-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-colors"
                            >
                                ← Volver al ingreso
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OlvidePassword;