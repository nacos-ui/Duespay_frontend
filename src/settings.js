const getBaseDomain = () => {
  const host = window.location.hostname;
  // For localhost: fcs.localhost or localhost
  if (host.endsWith('.localhost')) return 'localhost';
  // For production: fcs.duespay.app or duespay.app
  if (host.endsWith('.duespay.app') || host === 'duespay.app') return 'duespay.app';
  // Add more environments as needed
  return 'localhost'; // fallback
};

const SETTINGS = {
  BASE_DOMAIN: getBaseDomain(),
  // Add other settings as needed
};

export default SETTINGS;