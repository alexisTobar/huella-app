import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Publicar() {
  const [formData, setFormData] = useState({ 
    nombre: '', tipo: 'Perro', categoria: 'Perdida', telefono: '', ubicacion: '', comuna: 'Talagante', descripcion: '' 
  });
  const [files, setFiles] = useState([]); // Ahora es un array
  const [previews, setPreviews] = useState([]); // Para ver las fotos antes de subir
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const comunasMaipo = ["Talagante", "Isla de Maipo", "El Monte", "Peñaflor", "Padre Hurtado"];

  // Manejar selección de múltiples archivos
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 3) {
      alert("Solo puedes subir un máximo de 3 fotos");
      return;
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    // Generar previsualizaciones
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userJson = localStorage.getItem('usuarioTala');
    if (!userJson) return navigate('/login');
    const user = JSON.parse(userJson);

    setLoading(true);
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('tipo', formData.tipo);
    data.append('categoria', formData.categoria);
    data.append('telefono', formData.telefono);
    data.append('ubicacion', formData.ubicacion);
    data.append('comuna', formData.comuna);
    data.append('descripcion', formData.descripcion);
    data.append('autor', user.id || user._id);
    
    // Agregar las múltiples imágenes
    files.forEach(file => {
      data.append('image', file); // 'image' debe coincidir con el upload.array('image', 3) del backend
    });

    try {
      await api.post('/mascotas', data);
      alert('✅ Reporte creado con éxito');
      navigate('/mis-publicaciones'); 
    } catch (error) {
      console.error(error);
      alert('❌ Error al subir el reporte');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
        
        <div className="md:w-1/3 bg-slate-900 p-12 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-full h-full bg-orange-500/10 skew-x-12 translate-x-10"></div>
          <span className="text-6xl mb-6 relative z-10">📢</span>
          <h2 className="text-4xl font-black leading-tight mb-4 relative z-10 tracking-tighter">Tu reporte <br/><span className="text-orange-500">salva vidas.</span></h2>
          <p className="text-slate-400 text-sm font-medium relative z-10 leading-relaxed">Completa los datos con precisión para que la comunidad de Talagante pueda ayudarte rápidamente.</p>
          <span className="absolute -bottom-10 -left-10 text-9xl opacity-5 rotate-12">🐾</span>
        </div>

        <div className="md:w-2/3 p-10 md:p-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre de Mascota</label>
                <input type="text" placeholder="Ej: Bobby" required className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none transition-all font-bold text-slate-700 shadow-sm"
                  onChange={e => setFormData({...formData, nombre: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Estado</label>
                <select className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-slate-700 cursor-pointer shadow-sm"
                  onChange={e => setFormData({...formData, categoria: e.target.value})}>
                  <option value="Perdida">🔍 Perdida</option>
                  <option value="Adopcion">🏠 Adopción</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">¿Qué animal es?</label>
                <select className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-slate-700 cursor-pointer shadow-sm"
                  onChange={e => setFormData({...formData, tipo: e.target.value})}>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Comuna Maipo</label>
                <select className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-slate-700 cursor-pointer shadow-sm"
                  onChange={e => setFormData({...formData, comuna: e.target.value})}>
                  {comunasMaipo.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dirección o Referencia</label>
              <input type="text" placeholder="Ej: Calle 21 de Mayo 123" required className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-orange-600 shadow-sm"
                onChange={e => setFormData({...formData, ubicacion: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Descripción Detallada</label>
              <textarea placeholder="Ej: Mancha blanca, collar azul..." required className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-medium text-slate-600 h-36 resize-none shadow-sm"
                onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">WhatsApp de Contacto</label>
              <input type="text" placeholder="569 1234 5678" required className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-slate-700 shadow-sm"
                onChange={e => setFormData({...formData, telefono: e.target.value})} />
            </div>

            {/* SECCIÓN DE MÚLTIPLES FOTOS */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Fotos (Máximo 3)</label>
              <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-[2.5rem] p-8 text-center hover:bg-orange-100 transition-all cursor-pointer relative group">
                <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange} />
                <p className="text-orange-600 font-black text-xs uppercase tracking-widest">
                  📸 Haz clic para añadir fotos ({files.length}/3)
                </p>
              </div>

              {/* Previsualizaciones */}
              <div className="flex gap-4 justify-center">
                {previews.map((src, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                    <img src={src} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeFile(index)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center shadow-lg">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading || files.length === 0} className="w-full py-7 rounded-[2.5rem] bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-orange-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50">
              {loading ? 'PUBLICANDO...' : '🚀 PUBLICAR REPORTE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Publicar;