// Utility function to check if a color is dark
export const isColorDark = (color) => {
  if (!color) return false;
  
  let hex = color;
  
  // If it's not a hex color, convert it
  if (!color.startsWith('#')) {
    hex = convertToHex(color);
    if (!hex) return false; // Invalid color
  }
  
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse r, g, b values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness using luminance formula
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  // Return true if dark (brightness < 170)
  return brightness < 170;
};

// Helper function to convert named colors to hex
const convertToHex = (color) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = color;
  
  // If the color is invalid, fillStyle will be '#000000'
  if (ctx.fillStyle === '#000000' && color !== 'black') {
    return null; // Invalid color
  }
  
  return ctx.fillStyle;
};