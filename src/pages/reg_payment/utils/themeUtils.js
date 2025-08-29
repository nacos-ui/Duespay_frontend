export const pickId = (val) => {
  if (val == null) return null;
  return typeof val === 'object' ? (val.id ?? null) : val;
};

export const generateThemeStyles = (themeColor) => {
  if (!themeColor) return {};
  const lightColor = `${themeColor}20`;
  const darkColor = `${themeColor}80`;
  return { 
    '--theme-color': themeColor,
    '--theme-light': lightColor,
    '--theme-dark': darkColor,
  };
};

export const sanitizeName = (name) => {
  if (!name) return '';
  return String(name).replace(/[<>&"']/g, '').replace(/\s+/g, ' ').trim();
};