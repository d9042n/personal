import { MD5, SHA256 } from "crypto-js";

/**
 * Hashes a password using a two-step process:
 * 1. First hash with MD5
 * 2. Then hash the result with SHA256 for extra security
 * 
 * @param password - The plain text password to hash
 * @returns The hashed password as a string
 */
export const hashPassword = (password: string): string => {
  // First hash with MD5
  const md5Hash = MD5(password).toString();
  // Then hash with SHA256 for extra security
  return SHA256(md5Hash).toString();
}; 