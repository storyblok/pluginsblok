// TODO URL encode the value
/**
 * Createa
 * @param name
 * @param value
 */
export const changedCookieHeaderValue = (
  name: string,
  value: string,
  expires?: Date,
) => {
  return [
    `${name}=${value}`,
    'path=/',
    expires ? `Expires=${expires.toUTCString()}; ` : undefined,
    'samesite=none',
    'secure',
    'httponly',
    'partitioned',
  ]
    .filter(Boolean)
    .join('; ')
}
