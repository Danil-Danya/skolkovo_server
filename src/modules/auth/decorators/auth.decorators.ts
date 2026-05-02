import { UseGuards } from "@nestjs/common";
import { JWTAuthGuard } from "../guards/jwt_access.guard";
export { Roles } from "./roles.decorator";
export { ADMIN, MANAGER, USER } from "../dto/roles.dto";

export const Auth = () => UseGuards(JWTAuthGuard);
