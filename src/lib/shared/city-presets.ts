// Shared Vietnamese city presets with timezone + coordinates
// Used by HD calculator and Tử Vi calculator

export interface CityPreset {
  readonly label: string
  readonly tz: string
  readonly lat: number
  readonly lng: number
}

export const CITIES: readonly CityPreset[] = [
  { label: 'TP. Hồ Chí Minh', tz: 'Asia/Ho_Chi_Minh', lat: 10.8231, lng: 106.6297 },
  { label: 'Hà Nội', tz: 'Asia/Ho_Chi_Minh', lat: 21.0285, lng: 105.8542 },
  { label: 'Đà Nẵng', tz: 'Asia/Ho_Chi_Minh', lat: 16.0544, lng: 108.2022 },
  { label: 'Huế', tz: 'Asia/Ho_Chi_Minh', lat: 16.4637, lng: 107.5909 },
  { label: 'Cần Thơ', tz: 'Asia/Ho_Chi_Minh', lat: 10.0452, lng: 105.7469 },
  { label: 'Hải Phòng', tz: 'Asia/Ho_Chi_Minh', lat: 20.8449, lng: 106.6881 },
  { label: 'Nha Trang', tz: 'Asia/Ho_Chi_Minh', lat: 12.2388, lng: 109.1967 },
  { label: 'Đà Lạt', tz: 'Asia/Ho_Chi_Minh', lat: 11.9404, lng: 108.4583 },
  { label: 'Vũng Tàu', tz: 'Asia/Ho_Chi_Minh', lat: 10.346, lng: 107.0843 },
  { label: 'Quy Nhon', tz: 'Asia/Ho_Chi_Minh', lat: 13.776, lng: 109.2237 },
  { label: '— Khác / Other —', tz: '', lat: 0, lng: 0 },
] as const

export const CUSTOM_CITY_INDEX = CITIES.length - 1
