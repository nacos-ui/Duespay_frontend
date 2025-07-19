const getBaseDomain = () => {
  const host = window.location.hostname;
  if (host.endsWith('.localhost') || host === 'localhost') return 'localhost';
  if (host.endsWith('.duespay.app') || host === 'duespay.app') return 'duespay.app';
  return 'localhost'; // fallback
};

const SETTINGS = {
  BASE_DOMAIN: getBaseDomain(),
};

export default SETTINGS;