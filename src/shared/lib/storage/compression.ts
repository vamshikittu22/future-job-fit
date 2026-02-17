import LZString from 'lz-string';

export class CompressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompressionError';
  }
}

/**
 * Compress string using LZ-String UTF16
 * NOTE: Compression is for storage quota, not security
 */
export function compress(data: string): string {
  try {
    // UTF16 compression gives better ratio for typical text
    return LZString.compressToUTF16(data);
  } catch (error) {
    throw new CompressionError(`Compression failed: ${error}`);
  }
}

export function decompress(compressed: string): string {
  try {
    const result = LZString.decompressFromUTF16(compressed);
    if (result === null) {
      throw new CompressionError('Decompression returned null');
    }
    return result;
  } catch (error) {
    // Fallback: return raw (backward compatibility)
    console.warn('Decompression failed, returning raw data');
    return compressed;
  }
}

export function getCompressionRatio(original: string): number {
  const compressed = compress(original);
  const originalBytes = new Blob([original]).size;
  const compressedBytes = new Blob([compressed]).size;
  return originalBytes / compressedBytes;
}
