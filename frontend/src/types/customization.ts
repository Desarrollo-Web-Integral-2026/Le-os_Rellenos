export interface LenoCustomization {
  baseId: string | null
  rellenoIds: string[]
  salsaId: string | null
}

export const emptyCustomization: LenoCustomization = {
  baseId: null,
  rellenoIds: [],
  salsaId: null,
}