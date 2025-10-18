import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUsuarioSchema, loginUsuarioSchema, updateUsuarioSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Ruta de registro
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUsuarioSchema.parse(req.body);
      
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(userData.contraseña, 10);
      
      // Crear usuario con contraseña hasheada
      const userWithHashedPassword = {
        ...userData,
        contraseña: hashedPassword,
      };
      
      const newUser = await storage.insertUsuario(userWithHashedPassword);
      
      // No devolver la contraseña
      const { contraseña, ...userResponse } = newUser;
      
      res.status(201).json({ 
        success: true, 
        message: "Usuario creado exitosamente", 
        user: userResponse 
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Error al crear usuario" 
      });
    }
  });

  // Ruta de login
  app.post("/api/login", async (req, res) => {
    try {
      console.log("[LOGIN] body recibido:", req.body);
      const loginData = loginUsuarioSchema.parse(req.body);
      
      // Buscar usuario por email
      const user = await storage.getUsuarioByEmail(loginData.email);
      console.log("[LOGIN] usuario encontrado:", user ? { email: user.email, id: user.id_usuario } : null);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Email o contraseña incorrectos" 
        });
      }
      
      // Verificar contraseña
      console.log("[LOGIN] comparando contraseña… input length:", loginData.contraseña?.length, "hash length:", user.contraseña.length);
      const isPasswordValid = await bcrypt.compare(loginData.contraseña, user.contraseña);
      console.log("[LOGIN] resultado bcrypt.compare =", isPasswordValid);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: "Email o contraseña incorrectos" 
        });
      }
      
      // Login exitoso - no devolver la contraseña
      const { contraseña, ...userResponse } = user;
      
      res.json({ 
        success: true, 
        message: "Login exitoso", 
        user: userResponse,
        isAdmin: user.role === 'Admin'
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(400).json({ 
        success: false, 
        message: "Error en el login" 
      });
    }
  });

  // Endpoint temporal para depuración (solo desarrollo)
  app.post("/api/verify-hash", async (req, res) => {
    try {
      const { email, contraseña } = req.body;
      if (!email || !contraseña) {
        return res.status(400).json({ ok: false, message: "Falta email o contraseña" });
      }
      const user = await storage.getUsuarioByEmail(email);
      if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

      const valid = await bcrypt.compare(contraseña, user.contraseña);
      return res.json({
        ok: true,
        email: user.email,
        hash: user.contraseña,
        valid,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: "Error interno" });
    }
  });

  // Endpoint de estadísticas admin (simple: total de usuarios)
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const usersCount = await storage.countUsuarios();
      res.json({ success: true, usersCount });
    } catch (e) {
      console.error('Error obteniendo estadísticas admin:', e);
      res.status(500).json({ success: false, message: 'Error obteniendo estadísticas' });
    }
  });

  // Actualización de perfil usuario (PUT /api/users/:id)
  app.put('/api/users/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
      // Validar body parcial
      const parsed = updateUsuarioSchema.parse(req.body);
      const updated = await storage.updateUsuario(id, parsed);
      const { contraseña, ...userResponse } = updated;
      res.json({ success: true, user: userResponse });
    } catch (e) {
      console.error('Error actualizando usuario:', e);
      if (e instanceof Error) {
        return res.status(400).json({ success: false, message: e.message });
      }
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  });

  // Listado básico de usuarios para admin
  app.get('/api/admin/users', async (_req, res) => {
    try {
      const users = await storage.listUsuarios();
      res.json({ success: true, users });
    } catch (e) {
      console.error('Error listando usuarios:', e);
      res.status(500).json({ success: false, message: 'Error listando usuarios' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
