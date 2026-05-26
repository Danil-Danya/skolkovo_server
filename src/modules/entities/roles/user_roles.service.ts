import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { USER, type RoleNameDTO } from "src/modules/auth/dto/roles.dto";
import { PrismaService } from "src/database/prisma/prisma.service";

type RolePersistenceClient = Prisma.TransactionClient | PrismaService;

@Injectable()
export class UserRolesService {
    constructor (private prisma: PrismaService) {}

    private getClient (tx?: Prisma.TransactionClient): RolePersistenceClient {
        return tx ?? this.prisma;
    }

    async ensureUserHasRole (
        userId: string,
        roleName: RoleNameDTO, 
        tx?: Prisma.TransactionClient
    ): Promise<void> {
        const client = this.getClient(tx);

        const role = await client.roles.upsert({
            where: {
                name: roleName
            },
            update: {},
            create: {
                name: roleName
            }
        });

        await client.user_roles.upsert({
            where: {
                userId_roleId: {
                    userId,
                    roleId: role.id
                }
            },
            update: {},
            create: {
                userId,
                roleId: role.id
            }
        });
    }

    async ensureUserDefaultRole (userId: string, tx?: Prisma.TransactionClient): Promise<void> {
        await this.ensureUserHasRole(userId, USER, tx);
    }
}
