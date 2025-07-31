/**
 * @file project.ts
 * @description Proje verisi ile ilgili arayüzleri içerir.
 * @module types/project
 */

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy?: string; 
  createdAt?: string;
  updatedAt?: string;
}
