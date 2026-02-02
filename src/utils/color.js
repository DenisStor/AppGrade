const LIGHT_COLORS = ['#ffffff', '#f5f5f0', '#f0e4d3', '#e3e4e5']

export const isLightColor = (hex) => LIGHT_COLORS.includes(hex.toLowerCase())
