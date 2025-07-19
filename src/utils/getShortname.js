import SETTINGS from '../settings';

const RESERVED_SUBDOMAINS = ['www', ''];

export function extractShortName({ pathShortName = null } = {}) {
  const host = window.location.hostname;
  const parts = host.split('.');

  // localhost: shortname.localhost
  if (
    SETTINGS.BASE_DOMAIN === 'localhost' &&
    parts.length === 2 &&
    parts[1] === 'localhost' &&
    !RESERVED_SUBDOMAINS.includes(parts[0])
  ) {
    return parts[0];
  }

  // production: shortname.duespay.app
  if (
    SETTINGS.BASE_DOMAIN === 'duespay.app' &&
    parts.length === 3 &&
    parts[1] + '.' + parts[2] === 'duespay.app' &&
    !RESERVED_SUBDOMAINS.includes(parts[0])
  ) {
    return parts[0];
  }

  // fallback to path param (for /shortname)
  if (pathShortName && !RESERVED_SUBDOMAINS.includes(pathShortName)) {
    return pathShortName;
  }

  // No valid shortname found
  return null;
}