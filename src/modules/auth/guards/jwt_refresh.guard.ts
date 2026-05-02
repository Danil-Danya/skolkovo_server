import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JWTRefreshGuard extends AuthGuard("jwt-refresh") {
    handleRequest (err, user) {
        if (err || !user) {
            throw new UnauthorizedException('Авторизация не найдена или была удалена');
        }

        return user;
    }
}