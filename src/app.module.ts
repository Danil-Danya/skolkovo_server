import { Module } from '@nestjs/common';

import { PrismaModule } from './database/prisma/prisma.module';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/entities/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/entities/profiles/profile.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        PrismaModule,
        AuthModule,
        UserModule,
        ProfileModule
    ],
})
export class AppModule {}

