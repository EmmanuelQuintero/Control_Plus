import { sql } from "drizzle-orm";
import { mysqlTable, varchar, int, date, decimal, mysqlEnum } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabla Usuarios
export const usuarios = mysqlTable("Usuarios", {
  id_usuario: int("id_usuario").primaryKey().autoincrement(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  apellido: varchar("apellido", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  contraseña: varchar("contraseña", { length: 255 }).notNull(),
  edad: int("edad"),
  sexo: mysqlEnum("sexo", ["Hombre", "Mujer", "Otro"]),
  peso: decimal("peso", { precision: 5, scale: 2 }),
  altura: decimal("altura", { precision: 5, scale: 2 }),
  role: mysqlEnum("role", ["Usuario", "Admin"]).default("Usuario"),
});

// Tabla ActividadFisica
export const actividadFisica = mysqlTable("ActividadFisica", {
  id_actividad: int("id_actividad").primaryKey().autoincrement(),
  id_usuario: int("id_usuario").notNull(),
  fecha: date("fecha").notNull(),
  pasos: int("pasos"),
  calorias_quemadas: decimal("calorias_quemadas", { precision: 6, scale: 2 }),
  tipo_rutina: varchar("tipo_rutina", { length: 100 }),
  duracion_minutos: int("duracion_minutos"),
});

// Tabla Alimentacion
export const alimentacion = mysqlTable("Alimentacion", {
  id_alimento: int("id_alimento").primaryKey().autoincrement(),
  id_usuario: int("id_usuario").notNull(),
  fecha: date("fecha").notNull(),
  comida: mysqlEnum("comida", ["Desayuno", "Almuerzo", "Cena", "Snack"]),
  descripcion: varchar("descripcion", { length: 1000 }),
  calorias: decimal("calorias", { precision: 6, scale: 2 }),
  proteinas: decimal("proteinas", { precision: 6, scale: 2 }),
  grasas: decimal("grasas", { precision: 6, scale: 2 }),
  carbohidratos: decimal("carbohidratos", { precision: 6, scale: 2 }),
});

// Tabla Sueno
export const sueno = mysqlTable("Sueno", {
  id_sueno: int("id_sueno").primaryKey().autoincrement(),
  id_usuario: int("id_usuario").notNull(),
  fecha: date("fecha").notNull(),
  horas_dormidas: decimal("horas_dormidas", { precision: 4, scale: 2 }),
  calidad_sueno: mysqlEnum("calidad_sueno", ["Muy baja", "Baja", "Media", "Buena", "Excelente"]),
});

// Schemas para validación
export const insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id_usuario: true,
  role: true,
});

export const loginUsuarioSchema = z.object({
  email: z.string().email(),
  contraseña: z.string().min(1),
});

// Esquema para actualización parcial de perfil (incluye email editable, excluye contraseña y rol)
export const updateUsuarioSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  apellido: z.string().min(1).max(100).optional(),
  email: z.string().email().max(150).optional(),
  edad: z.number().int().min(0).max(130).optional(),
  sexo: z.enum(["Hombre", "Mujer", "Otro"]).optional(),
  peso: z.number().min(0).max(500).optional(),
  altura: z.number().min(0).max(300).optional(),
});

export const insertActividadFisicaSchema = createInsertSchema(actividadFisica).omit({
  id_actividad: true,
});

export const insertAlimentacionSchema = createInsertSchema(alimentacion).omit({
  id_alimento: true,
});

export const insertSuenoSchema = createInsertSchema(sueno).omit({
  id_sueno: true,
});

// Types
export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;
export type LoginUsuario = z.infer<typeof loginUsuarioSchema>;
export type UpdateUsuario = z.infer<typeof updateUsuarioSchema>;
export type Usuario = typeof usuarios.$inferSelect;
export type ActividadFisica = typeof actividadFisica.$inferSelect;
export type Alimentacion = typeof alimentacion.$inferSelect;
export type Sueno = typeof sueno.$inferSelect;
