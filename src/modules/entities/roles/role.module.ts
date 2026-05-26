import { Module } from "@nestjs/common";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { UserRolesService } from "./user_roles.service";

@Module({
    controllers: [RoleController],
    providers: [RoleService, UserRolesService],
    exports: [RoleService, UserRolesService]
})
export class RoleModule {}
