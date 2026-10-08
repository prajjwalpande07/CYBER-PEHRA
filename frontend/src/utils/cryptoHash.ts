/**
 * Cryptographic hash simulator and helper for Blockchain Audit Trail
 */
export function generateSha256Hash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  
  // Format as pseudo 64-char hex string
  const hexPart1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hexPart2 = Math.abs(hash * 31).toString(16).padStart(8, '0');
  const hexPart3 = Math.abs(hash * 73).toString(16).padStart(8, '0');
  const hexPart4 = Math.abs(hash * 127).toString(16).padStart(8, '0');
  const hexPart5 = Math.abs(hash * 251).toString(16).padStart(8, '0');
  const hexPart6 = Math.abs(hash * 509).toString(16).padStart(8, '0');
  const hexPart7 = Math.abs(hash * 1021).toString(16).padStart(8, '0');
  const hexPart8 = Math.abs(hash * 2039).toString(16).padStart(8, '0');

  return `0x${hexPart1}${hexPart2}${hexPart3}${hexPart4}${hexPart5}${hexPart6}${hexPart7}${hexPart8}`.slice(0, 66);
}

export function truncateHash(hash: string, start: number = 8, end: number = 6): string {
  if (!hash || hash.length < start + end + 3) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
