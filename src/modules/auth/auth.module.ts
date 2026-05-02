import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../entities/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JWTAuthGuard } from "./guards/jwt_access.guard";
import { JWTRefreshGuard } from "./guards/jwt_refresh.guard";
import { RolesGuard } from "./guards/permission.guard";
import { JWTStrategyAccess } from "./jwt/jwt_access.strategy";
import { JWTStrategyRefresh } from "./jwt/jwt_refresh.strategy";

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        JWTAuthGuard,
        JWTRefreshGuard,
        RolesGuard,
        JWTStrategyAccess,
        JWTStrategyRefresh
    ],
    exports: [
        AuthService,
        JWTAuthGuard, 
        JWTRefreshGuard, 
        RolesGuard
    ],
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({})
    ]
})
export class AuthModule {}
