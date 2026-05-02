import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

import { UsersService } from "src/modules/entities/users/users.service";
import { RefreshPayloadDTO, RefreshRequestUserDTO } from "./jwt.dto";

const extractRefreshToken = (request: Request) => {
    if (!request) {
        return null;
    }

    if (typeof request.body?.refreshToken === "string") {
        return request.body.refreshToken;
    }

    return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
};

@Injectable()
export class JWTStrategyRefresh extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(
        private usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshToken]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET_KEY,
        });
    }

    async validate(payload: RefreshPayloadDTO): Promise<RefreshRequestUserDTO> {
        if (payload.tokenType !== "refresh") {
            throw new UnauthorizedException("Неверный тип токена");
        }

        const user = await this.usersService.getOneUserById(payload.id);

        return {
            id: user.id
        };
    }
}
