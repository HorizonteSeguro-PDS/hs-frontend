import { useShelters } from '@/features/shelters/hooks';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// CORREÇÃO OBRIGATÓRIA PARA O VITE/WEBPACK:
// O Leaflet tem um bug nativo ao carregar os ícones padrão em bundlers modernos.
// Precisamos importar os caminhos das imagens e injetar de volta no protótipo.
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

interface CrisisMapProps {
    crisisId: string;
}

export default function CrisisMap({ crisisId }: CrisisMapProps) {
    const { data: crisisData, isPending, isError } = useShelters(crisisId);

    if (isPending) {
        return (
            <div className="flex h-[500px] w-full items-center justify-center rounded-xl bg-gray-100 border border-gray-200">
                <span className="loading loading-spinner text-primary">Carregando mapa...</span>
            </div>
        );
    }

    if (isError || !crisisData) {
        return (
            <div className="flex h-[500px] w-full items-center justify-center rounded-xl bg-red-50 text-red-500 border border-red-200">
                <span>Erro ao carregar as informações da região.</span>
            </div>
        );
    }

    const defaultCenter: [number, number] = [-15.7801, -47.9292];
    const mapCenter: [number, number] = crisisData.shelters.length > 0
        ? [crisisData.shelters[0].latitude, crisisData.shelters[0].longitude]
        : defaultCenter;

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="px-2">
                <h2 className="text-2xl font-bold text-gray-800">{crisisData.crisis_name}</h2>
                <p className="text-gray-500">{crisisData.city} - {crisisData.state} • {crisisData.shelters_count} Abrigo(s) disponível(is)</p>
            </div>

            {/* O container do mapa precisa obrigatoriamente de uma altura definida */}
            <div className="h-[600px] w-full overflow-hidden rounded-xl shadow-lg border border-gray-300 z-0 relative">
                <MapContainer 
                    center={mapCenter} 
                    zoom={13} 
                    scrollWheelZoom={true} 
                    style={{ height: '100%', width: '100%' }}
                >
                    {/* Camada visual do mapa (OpenStreetMap é grátis e não requer chave de API) */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Iterando sobre a lista de abrigos para desenhar os pinos */}
                    {crisisData.shelters.map((shelter) => {
                        
                        // Cálculo da porcentagem de lotação para colorir o texto
                        const occupancyRate = (shelter.current_occupancy / shelter.capacity) * 100;
                        const isFull = occupancyRate >= 100;

                        return (
                            <Marker 
                                key={shelter.id} 
                                position={[shelter.latitude, shelter.longitude]}
                            >
                                {/* O Popup é o balão que abre quando você clica no pino */}
                                <Popup className="min-w-[250px]">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg font-bold text-gray-800 m-0 leading-tight">
                                            {shelter.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 m-0">
                                            {shelter.address}
                                        </p>

                                        <div className="h-px w-full bg-gray-200 my-1"></div>

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-gray-700">Ocupação:</span>
                                            <span className={`font-bold ${isFull ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {shelter.current_occupancy} / {shelter.capacity}
                                            </span>
                                        </div>

                                        {/* Barra de progresso de ocupação visual */}
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div 
                                                className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                                style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                                            ></div>
                                        </div>

                                        {shelter.urgent_needs.length > 0 && (
                                            <div className="mt-2">
                                                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                                                    Necessidades Urgentes:
                                                </span>
                                                <ul className="list-disc pl-4 text-xs text-gray-600 mt-1 m-0">
                                                    {shelter.urgent_needs.slice(0, 3).map((need, index) => (
                                                        <li key={index}>{need}</li>
                                                    ))}
                                                    {shelter.urgent_needs.length > 3 && (
                                                        <li className="text-gray-400 italic">
                                                            + {shelter.urgent_needs.length - 3} outros
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}