import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function ResetPassword() {
    const { token } = useParams();
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nuevaPassword !== confirmarPassword) {
            alert("❌ Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { nuevaPassword });
            alert("✅ Contraseña actualizada con éxito");
            navigate('/login');
        } catch (error) {
            alert("❌ Error: " + (error.response?.data?.mensaje || "Token inválido o expirado"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center">
                <span className="text-5xl block mb-6">🔐</span>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2">Nueva Contraseña</h2>
                <p className="text-slate-500 font-medium text-sm mb-8">Ingresa tu nueva clave de acceso.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="password" 
                        required 
                        placeholder="Nueva contraseña"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold"
                        onChange={(e) => setNuevaPassword(e.target.value)}
                    />
                    <input 
                        type="password" 
                        required 
                        placeholder="Confirmar nueva contraseña"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold"
                        onChange={(e) => setConfirmarPassword(e.target.value)}
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50"
                    >
                        {loading ? 'ACTUALIZANDO...' : 'REABLECER CONTRASEÑA'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;