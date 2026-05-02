import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UsersService } from "src/modules/entities/users/users.service";
import { JWTAccessPayloadDTO } from "./jwt.dto";

@Injectable()
export class JWTStrategyAccess extends PassportStrategy(Strategy, 'jwt-access') {
    constructor (private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET_KEY
        });
    }

    async validate (payload: JWTAccessPayloadDTO) {
        if (payload.tokenType !== 'access') {
            throw new UnauthorizedException('Неверный тип токена');
        }

        const user = await this.userService.getOneUserById(payload.id);
        return user;
    }
}
