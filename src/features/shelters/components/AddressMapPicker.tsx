import { useEffect, useRef } from 'preact/hooks'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

interface AddressMapPickerProps {
  latitude: number | null
  longitude: number | null
  onSelect: (latitude: number, longitude: number) => void
}

const BRAZIL_CENTER: [number, number] = [-14.235, -51.9253]
const BRAZIL_ZOOM = 4
const SELECTED_ZOOM = 16

export default function AddressMapPicker({ latitude, longitude, onSelect }: AddressMapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current).setView(BRAZIL_CENTER, BRAZIL_ZOOM)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    map.on('click', (event: L.LeafletMouseEvent) => {
      onSelectRef.current(event.latlng.lat, event.latlng.lng)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || latitude == null || longitude == null) return

    const position: [number, number] = [latitude, longitude]

    if (markerRef.current) {
      markerRef.current.setLatLng(position)
    } else {
      markerRef.current = L.marker(position).addTo(map)
    }

    map.setView(position, SELECTED_ZOOM)
  }, [latitude, longitude])

  return (
    <div className="flex flex-col gap-1">
      <div ref={containerRef} className="h-56 w-full overflow-hidden rounded-xl border border-[#0A0A0A33]" />
      <p className="text-xs text-[#0A0A0A80]">Clique no mapa para ajustar a localização exata do abrigo.</p>
    </div>
  )
}
