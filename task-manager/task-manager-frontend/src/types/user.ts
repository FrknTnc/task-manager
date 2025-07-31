/**
 * @file user.ts
 * @description Kullanıcı rolleri ve kullanıcı arayüzü tanımlarını içerir.
 * @module types/user
 */

export type Role = "Admin" | "Manager" | "Developer";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
}
