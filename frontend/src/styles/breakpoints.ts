export const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1440,
} as const

export type Breakpoint = keyof typeof breakpoints