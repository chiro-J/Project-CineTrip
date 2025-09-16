import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    login(googleUser: any): {
        access_token: string;
        user: {
            email: any;
            username: any;
        };
    };
}
