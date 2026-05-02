import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt-access') {
    handleRequest (error, user) {
        if (error || !user) {
            throw new UnauthorizedException('Сессия не доступна или не найдена');
        }

        return user;
    }
}
