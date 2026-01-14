import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function PublicarProducto() {
  const [formData, setFormData] = useState({ 
    titulo: '', precio: '', descripcion: '', whatsappVendedor: '', categoria: 'Accesorios' 
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categorias = ['Alimento', 'Accesorios', 'Salud', 'Juguetes'];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 3) {
      alert("Máximo 3 fotos permitidas");
      return;
    }
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userJson = localStorage.getItem('usuarioTala');
    if (!userJson) return navigate('/login');
    const user = JSON.parse(userJson);

    setLoading(true);
    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('precio', formData.precio);
    data.append('descripcion', formData.descripcion);
    // MEJORA: El prefijo +569 ya está incluido visualmente, lo concatenamos para el backend
    data.append('whatsappVendedor', `+569${formData.whatsappVendedor}`);
    data.append('categoria', formData.categoria);
    data.append('autor', user.id || user._id); 
    
    files.forEach(file => { data.append('image', file); });

    try {
      await api.post('/productos', data);
      alert('💰 ¡Producto publicado!');
      navigate('/mis-publicaciones'); 
    } catch (error) {
      console.error(error);
      alert('❌ Error al publicar');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* MEJORA: FONDO DE HUELLAS DIFUMINADO ESMERALDA */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.01] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paws.png')` }}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-100/40 dark:from-emerald-900/10 via-transparent to-emerald-50/30 z-0 blur-3xl"></div>

      <div className="max-w-5xl w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row relative z-10 transition-colors duration-500">
        
        <div className="md:w-1/3 bg-slate-900 dark:bg-black p-12 text-white flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 relative transition-colors duration-500">
          <div className="absolute top-0 right-0 w-full h-full bg-emerald-500/10 skew-x-12 translate-x-10 pointer-events-none"></div>
          <span className="text-4xl mb-6 relative z-10">🛍️</span>
          <h2 className="text-3xl font-black leading-tight mb-4 tracking-tighter uppercase relative z-10">Vender en <br/><span className="text-emerald-500">Mercado.</span></h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed relative z-10 uppercase italic">Emprende con nosotros llegando a toda la comunidad Maipo.</p>
          
          <div className="mt-20 pt-8 border-t border-white/10 relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ayuda Ventas</p>
            <p className="text-sm font-bold mt-2 text-emerald-500">+569 77922875</p>
          </div>
          <span className="absolute -bottom-10 -left-10 text-9xl opacity-5 rotate-12 pointer-events-none">🦴</span>
        </div>

        <div className="md:w-2/3 p-10 md:p-16 dark:bg-slate-900/50 backdrop-blur-sm transition-colors duration-500">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Título</label>
                <input type="text" placeholder="Ej: Saco de Dormir" required className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-b-2 border-transparent focus:border-emerald-500 py-3 px-4 outline-none transition-all font-bold text-slate-800 rounded-xl"
                  onChange={e => setFormData({...formData, titulo: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Categoría</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-b-2 border-transparent focus:border-emerald-500 py-3 px-4 outline-none font-bold text-slate-800 appearance-none rounded-xl"
                  onChange={e => setFormData({...formData, categoria: e.target.value})}>
                  {categorias.map(cat => <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Precio (CLP)</label>
                <input type="number" placeholder="9990" required className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-b-2 border-transparent focus:border-emerald-500 py-3 px-4 outline-none font-black text-slate-800 rounded-xl"
                  onChange={e => setFormData({...formData, precio: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">WhatsApp Ventas</label>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 rounded-xl border border-slate-100 dark:border-slate-700 focus-within:border-emerald-500 transition-all">
                  <span className="font-black text-slate-400 dark:text-slate-500 text-sm border-r border-slate-200 dark:border-slate-700 pr-3">+569</span>
                  <input type="text" maxLength="8" placeholder="87654321" required className="flex-grow bg-transparent py-4 outline-none font-black text-slate-800 dark:text-white"
                    onChange={e => setFormData({...formData, whatsappVendedor: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Detalles</label>
              <textarea placeholder="Cuéntanos del producto..." required className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white p-4 rounded-2xl border-2 border-transparent focus:border-emerald-500 outline-none font-medium text-slate-600 dark:text-slate-300 h-32 resize-none transition-colors"
                onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Fotos (Máx 3)</label>
              <div className="grid grid-cols-4 gap-4">
                <label className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-emerald-500 transition-colors group">
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  <span className="text-2xl text-slate-400 dark:text-slate-500 group-hover:text-white transition-transform group-active:scale-90">+</span>
                </label>
                {previews.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-white dark:border-slate-700 shadow-sm transition-all">
                    <img src={src} className="w-full h-full object-cover" alt="preview" />
                    <button type="button" onClick={() => removeFile(index)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black text-[10px]">QUITAR</button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-6 bg-slate-900 dark:bg-emerald-600 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-xl disabled:opacity-50 active:scale-[0.98]">
              {loading ? 'PROCESANDO...' : '💰 PUBLICAR EN TIENDA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PublicarProducto;