import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/database/prisma/prisma.service";
import { RoleNameDTO } from "../dto/roles.dto";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor (
        private reflector: Reflector,
        private prisma: PrismaService
    ) {}

    public async canActivate (context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<RoleNameDTO[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!roles?.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        if (!request.user?.id) {
            throw new ForbiddenException("Permission denied");
        }

        const userRoles = await this.prisma.user_roles.findMany({
            where: {
                userId: request.user.id
            },
            include: {
                role: true
            }
        });

        const hasRole = userRoles.some((userRole) => roles.includes(userRole.role.name as RoleNameDTO));

        if (!hasRole) {
            throw new ForbiddenException("Permission denied");
        }

        return true;
    }
}
