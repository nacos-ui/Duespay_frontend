import SETTINGS from '../settings';

const RESERVED_SUBDOMAINS = ['www'];

export const getShortNameFromUrl = (pathShortName) => {
  const host = window.location.hostname;
  const parts = host.split('.');

  // For localhost: fcs.localhost
  if (
    SETTINGS.BASE_DOMAIN === 'localhost' &&
    parts.length === 2 &&
    parts[1] === 'localhost' &&
    !RESERVED_SUBDOMAINS.includes(parts[0])
  ) {
    return parts[0];
  }

  // For production: fcs.duespay.app
  if (
    SETTINGS.BASE_DOMAIN === 'duespay.app' &&
    parts.length === 3 &&
    parts[1] + '.' + parts[2] === 'duespay.app'
  ) {
    return parts[0];
  }

  // fallback to path param
  return pathShortName;
};