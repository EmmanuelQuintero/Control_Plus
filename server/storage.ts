import { type Usuario, type InsertUsuario, type UpdateUsuario, usuarios } from "@shared/schema";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

export interface IStorage {
  getUsuario(id: number): Promise<Usuario | undefined>;
  getUsuarioByEmail(email: string): Promise<Usuario | undefined>;
  insertUsuario(user: InsertUsuario): Promise<Usuario>;
  countUsuarios(): Promise<number>;
  listUsuarios(): Promise<Pick<Usuario, 'id_usuario' | 'nombre' | 'apellido' | 'email' | 'role'>[]>;
  updateUsuario(id: number, data: UpdateUsuario): Promise<Usuario>;
  insertOrUpdateActividadFisica(data: { id_usuario: number; fecha: string; pasos: number; duracion_minutos: number }): Promise<void>;
  getActividadesFisicas(id_usuario: number, from?: string, to?: string): Promise<any[]>;
}

import { actividadFisica } from "@shared/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async insertOrUpdateActividadFisica(data: { id_usuario: number; fecha: string; pasos: number; duracion_minutos: number }): Promise<void> {
    const db = await getDb();
  // Trabajar con fecha como string 'YYYY-MM-DD' directamente
  const fechaStr = data.fecha;
    // Buscar si ya existe registro para ese usuario y fecha
    // Upsert: insert y si hay conflicto por índice único, actualizar
    await db
      .insert(actividadFisica)
      .values({
        id_usuario: data.id_usuario,
        fecha: fechaStr,
        pasos: data.pasos,
        duracion_minutos: data.duracion_minutos,
      })
      .onDuplicateKeyUpdate({
        set: {
          pasos: data.pasos,
          duracion_minutos: data.duracion_minutos,
        },
      });
  }

  async getActividadesFisicas(id_usuario: number, from?: string, to?: string): Promise<any[]> {
    const db = await getDb();
    let whereClause;
    if (from && to) {
      const fromStr = from; // 'YYYY-MM-DD'
      const toStr = to;     // 'YYYY-MM-DD'
      whereClause = and(
        eq(actividadFisica.id_usuario, id_usuario),
        gte(actividadFisica.fecha, fromStr),
        lte(actividadFisica.fecha, toStr)
      );
    } else {
      whereClause = eq(actividadFisica.id_usuario, id_usuario);
    }
    // Ordenar por fecha descendente (más reciente primero)
    return await db.select().from(actividadFisica).where(whereClause).orderBy(sql`fecha DESC`);
  }
  async getUsuario(id: number): Promise<Usuario | undefined> {
    const db = await getDb();
    const result = await db.select().from(usuarios).where(eq(usuarios.id_usuario, id)).limit(1);
    return result[0];
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
    const db = await getDb();
    const result = await db.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
    return result[0];
  }

  async insertUsuario(insertUsuario: InsertUsuario): Promise<Usuario> {
    const db = await getDb();
    const result = await db.insert(usuarios).values(insertUsuario);
    const insertedId = result[0].insertId;
    
    // Obtener el usuario recién insertado
    const newUsuario = await this.getUsuario(Number(insertedId));
    if (!newUsuario) {
      throw new Error("Error al crear el usuario");
    }
    
    return newUsuario;
  }

  async countUsuarios(): Promise<number> {
    const db = await getDb();
    // Drizzle: seleccionar COUNT(*)
    const result = await db.select({ count: sql<number>`COUNT(*)` }).from(usuarios);
    return result[0]?.count ?? 0;
  }

  async listUsuarios(): Promise<Pick<Usuario, 'id_usuario' | 'nombre' | 'apellido' | 'email' | 'role'>[]> {
    const db = await getDb();
    const result = await db
      .select({
        id_usuario: usuarios.id_usuario,
        nombre: usuarios.nombre,
        apellido: usuarios.apellido,
        email: usuarios.email,
        role: usuarios.role,
      })
      .from(usuarios);
    return result;
  }

  async updateUsuario(id: number, data: UpdateUsuario): Promise<Usuario> {
    const db = await getDb();
    // Construir objeto de actualización filtrando undefined
    const updateData: Record<string, any> = {};
    for (const key of [
      'nombre','apellido','email','edad','sexo','peso','altura'
    ] as const) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    if (Object.keys(updateData).length === 0) {
      const existing = await this.getUsuario(id);
      if (!existing) throw new Error('Usuario no encontrado');
      return existing;
    }
    await db.update(usuarios).set(updateData).where(eq(usuarios.id_usuario, id));
    const updated = await this.getUsuario(id);
    if (!updated) throw new Error('Usuario no encontrado tras actualizar');
    return updated;
  }
}

export const storage = new DatabaseStorage();
