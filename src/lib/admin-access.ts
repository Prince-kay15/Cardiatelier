const ownerEmails = new Set(["princekay043@gmail.com", "cardiatelier1@gmail.com"]);

export function hasAdminAccess(roleResult: unknown, email: string | null | undefined): boolean {
  return roleResult === true && typeof email === "string" && ownerEmails.has(email.trim().toLowerCase());
}