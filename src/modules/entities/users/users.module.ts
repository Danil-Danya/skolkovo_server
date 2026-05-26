import { Module } from "@nestjs/common";
import { RoleModule } from "../roles/role.module";
import { UsersController } from "./uses.controller";
import { UsersService } from "./users.service";

@Module({
    imports: [RoleModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UserModule {}
