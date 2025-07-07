// Utility function to check if a color is dark
export const isColorDark = (color) => {
  if (!color) return false;
  
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Parse r, g, b values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness using luminance formula
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  // Return true if dark (brightness < 228)
  return brightness < 158;
};