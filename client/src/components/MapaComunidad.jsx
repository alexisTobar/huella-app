import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- CONFIGURACIÓN DE ICONOS DE COLORES ---
const iconPerdido = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const iconAdopcion = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// Componente auxiliar para recentrar el mapa suavemente
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

function MapaComunidad({ mascotas }) {
  const centerDefault = [-33.6644, -70.9272]; // Talagante
  const [mapCenter, setMapCenter] = useState(centerDefault);

  // Intentar obtener la ubicación del usuario al cargar
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
      () => console.log("Ubicación denegada, usando centro por defecto")
    );
  }, []);

  // Coordenadas aproximadas por comuna para reportes sin GPS exacto
  const coordsComunas = {
    "Talagante": [-33.6644, -70.9272],
    "Melipilla": [-33.6854, -71.2154],
    "Peñaflor": [-33.6061, -70.8764],
    "El Monte": [-33.6806, -71.0175],
    "Isla de Maipo": [-33.7483, -70.9022],
    "Padre Hurtado": [-33.5700, -70.8200]
  };

  return (
    <div className="h-[450px] md:h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-10">
      <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={mapCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        {mascotas.map((pet) => {
          let posicion = null;

          // 1. Prioridad: Si tiene avistamientos con coordenadas GPS
          if (pet.avistamientos && pet.avistamientos.length > 0 && pet.avistamientos[0].coordenadas?.lat) {
            posicion = [pet.avistamientos[0].coordenadas.lat, pet.avistamientos[0].coordenadas.lng];
          } 
          // 2. Si no tiene GPS, usamos la ubicación de la COMUNA
          else if (pet.comuna && coordsComunas[pet.comuna]) {
            // Agregamos un pequeño "ruido" aleatorio para que los pines no se encimen todos en el mismo punto exacto
            const randomLat = (Math.random() - 0.5) * 0.01;
            const randomLng = (Math.random() - 0.5) * 0.01;
            posicion = [coordsComunas[pet.comuna][0] + randomLat, coordsComunas[pet.comuna][1] + randomLng];
          }

          if (!posicion) return null;

          return (
            <Marker 
              key={pet._id} 
              position={posicion}
              icon={pet.categoria === 'Perdida' ? iconPerdido : iconAdopcion}
            >
              <Popup>
                <div className="text-center font-sans w-32">
                  <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden mb-2 shadow-md">
                    <img 
                        src={pet.fotos?.[0] || pet.fotoUrl || 'https://i.postimg.cc/C5vpkC30/Copilot-20260110-194421.png'} 
                        className="w-full h-full object-cover" 
                        alt="pet" 
                    />
                  </div>
                  <h4 className="font-black uppercase text-[10px] m-0 text-slate-800">{pet.nombre}</h4>
                  <p className={`text-[8px] font-black uppercase mt-1 ${pet.categoria === 'Perdida' ? 'text-red-500' : 'text-orange-500'}`}>
                    {pet.categoria}
                  </p>
                  <p className="text-[7px] text-slate-400 font-bold mb-2">📍 {pet.comuna}</p>
                  <a 
                    href={`https://wa.me/${pet.contacto?.telefono || pet.telefono}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block bg-slate-900 text-white py-1.5 rounded-full text-[8px] font-black uppercase no-underline hover:bg-orange-500 transition-colors"
                  >
                    Contactar
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapaComunidad;