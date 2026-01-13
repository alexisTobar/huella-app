import { useState } from 'react';
import api from '../api/axios';

function OlvidePassword() {
    const [email, setEmail] = useState('');
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/olvide-password', { email });
            setEnviado(true);
        } catch (error) {
            alert("Error: " + (error.response?.data?.mensaje || "No se pudo enviar el correo"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                {!enviado ? (
                    <form onSubmit={handleSubmit} className="space-y-6 text-center">
                        <span className="text-5xl block">🔑</span>
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">¿Olvidaste tu clave?</h2>
                        <p className="text-slate-500 font-medium text-sm">Ingresa tu correo y te enviaremos un link para restablecerla.</p>
                        <input 
                            type="email" 
                            required 
                            placeholder="tu@correo.com"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl">
                            Enviar Instrucciones
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="text-6xl mb-6">📧</div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">¡Correo Enviado!</h2>
                        <p className="text-slate-500 font-bold mt-4 leading-relaxed">
                            Revisa tu bandeja de entrada (y la carpeta de spam) para continuar.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OlvidePassword;