import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { RoleNameDTO } from "../dto/roles.dto";
import { JWTAuthGuard } from "../guards/jwt_access.guard";
import { RolesGuard } from "../guards/permission.guard";

export const ROLES_KEY = "roles";

export const Roles = (roles: RoleNameDTO[]) => {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(JWTAuthGuard, RolesGuard)
    );
}
