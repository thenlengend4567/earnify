import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default-secret-key-change-me';
const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function hashPassword(password: string): Promise<string> {
    return hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
}

interface SessionPayload {
    userId: string;
    role: string;
    expiresAt: Date;
}

export async function createSession(userId: string, role: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await new SignJWT({ userId, role, expiresAt })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);

    return session;
}

export async function verifySession(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload as unknown as SessionPayload;
    } catch (error) {
        return null;
    }
}
