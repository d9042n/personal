import { MD5, SHA256 } from "crypto-js";

export const hashPassword = (password: string): string => {
  // First hash with MD5
  const md5Hash = MD5(password).toString();
  // Then hash with SHA256 for extra security
  return SHA256(md5Hash).toString();
}; 