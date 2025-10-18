import { type Usuario, type InsertUsuario, type UpdateUsuario, usuarios } from "@shared/schema";
import { getDb } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getUsuario(id: number): Promise<Usuario | undefined>;
  getUsuarioByEmail(email: string): Promise<Usuario | undefined>;
  insertUsuario(user: InsertUsuario): Promise<Usuario>;
  countUsuarios(): Promise<number>;
  listUsuarios(): Promise<Pick<Usuario, 'id_usuario' | 'nombre' | 'apellido' | 'email' | 'role'>[]>;
  updateUsuario(id: number, data: UpdateUsuario): Promise<Usuario>;
}

export class DatabaseStorage implements IStorage {
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
