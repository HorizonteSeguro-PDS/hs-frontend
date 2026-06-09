const apiUrl = import.meta.env.VITE_API_URL

export interface AddressResult {
  label: string
  latitude: number
  longitude: number
}

export interface CepAddress {
  rua: string
  bairro: string
  cidade: string
  estado: string
}

export async function lookupCep(cep: string): Promise<CepAddress | null> {
  const digits = cep.replace(/\D/g, '')
  if (digits.length !== 8) return null

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
  const data = await response.json()

  if (data.erro) return null

  return {
    rua: data.logradouro ?? '',
    bairro: data.bairro ?? '',
    cidade: data.localidade ?? '',
    estado: data.uf ?? '',
  }
}

export interface ReverseGeocodeResult {
  endereco: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResult | null> {
  const response = await fetch(`https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}`)
  const data = await response.json()
  const feature = data.features?.[0]
  if (!feature) return null

  const { name, housenumber, street, district, city, state, postcode } = feature.properties ?? {}

  return {
    endereco: [street ?? name, housenumber].filter(Boolean).join(', '),
    bairro: district ?? '',
    cidade: city ?? '',
    estado: state ?? '',
    cep: postcode ?? '',
  }
}

export async function searchAddress(query: string): Promise<AddressResult[]> {
  const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`)
  const data = await response.json()

  return (data.features ?? []).map((feature: any) => {
    const { name, housenumber, street, city, state, country } = feature.properties ?? {}
    const [longitude, latitude] = feature.geometry?.coordinates ?? [0, 0]
    const streetLine = [street ?? name, housenumber].filter(Boolean).join(', ')
    return {
      label: [streetLine, city, state, country].filter(Boolean).join(', '),
      latitude,
      longitude,
    }
  })
}
