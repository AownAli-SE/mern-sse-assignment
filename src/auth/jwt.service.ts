import { Algorithm, sign, verify } from 'jsonwebtoken'
import { Role } from '../utilities/types/user'

export class JwtService {
    private secret = process.env.JWT_SECRET as string
    private issuer = process.env.JWT_ISSUER as string
    private expiresIn = process.env.JWT_EXPIRATION as string
    private algorithm: Algorithm = 'HS384'

    getToken(audience: string, userId: string, email: string, role: Role = "buyer") {
        const payload = {id: userId, email, role}

        const token = sign(payload, this.secret, {
            audience,
            issuer: this.issuer,
            expiresIn: this.expiresIn,
            algorithm: this.algorithm,
        })

        console.log('token',token)
        return token
    }

    verifyToken(jwtToken: string, audience: string) {
        const payload = verify(jwtToken, this.secret, {
            algorithms: [this.algorithm], 
            issuer: this.issuer,
            audience, 
        })

        console.log('payload',payload)
        return payload
    }

    //////////////////////
    /// Singleton pattern
    //////////////////////
    private static _instance: JwtService | null = null
    private constructor() {
        if(!this.secret || !this.expiresIn || !this.issuer) {
            throw new Error("JWT environment variables not defined!")
        }
    }

    static getInstance() {
        if(!JwtService._instance) {
            JwtService._instance = new JwtService()
        }

        return JwtService._instance
    }
}


