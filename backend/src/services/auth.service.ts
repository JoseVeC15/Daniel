// backend/src/services/auth.service.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

const prisma = new PrismaClient();

export class AuthService {
  async login(email: string, pass: string) {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user || !user.activo) {
      throw new Error('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(pass, user.passwordHash);
    if (!valid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN }
    );

    return {
      usuario: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      token,
    };
  }

  async register(data: any) {
    const hash = await bcrypt.hash(data.password, 10);
    return prisma.usuario.create({
      data: {
        email: data.email,
        nombre: data.nombre,
        passwordHash: hash,
        rol: data.rol || 'OPERADOR',
      },
      select: { id: true, nombre: true, email: true, rol: true },
    });
  }

  async obtenerPerfil(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nombre: true, email: true, rol: true },
    });
  }
}
