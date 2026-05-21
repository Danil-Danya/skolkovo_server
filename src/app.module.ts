import { Module } from '@nestjs/common';

import { PrismaModule } from './database/prisma/prisma.module';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/entities/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/entities/profiles/profile.module';
import { NewsModule } from './modules/entities/news/news.module';
import { EventModule } from './modules/entities/events/events.module';
import { EventRegistrationsModule } from './modules/entities/events_registrations/event_registrations.module';
import { LocationsModule } from './modules/entities/locations/locations.module';
import { CompanyModule } from './modules/entities/companies/company.module';
import { PositionModule } from './modules/entities/positions/position.module';
import { NotificationModule } from './modules/entities/notificatations/notification.module';
import { CompanyCategoriesModule } from './modules/entities/company_categories/company_categories.module';
import { FollowersModule } from './modules/entities/followers/follower.module';
import { NewsCategoriesModule } from './modules/entities/news_categories/news_categories.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        PrismaModule,
        AuthModule,
        UserModule,
        ProfileModule,
        FollowersModule,
        NewsCategoriesModule,
        NewsModule,
        EventModule,
        EventRegistrationsModule,
        LocationsModule, 
        CompanyCategoriesModule,
        CompanyModule,
        PositionModule,
        NotificationModule
    ],
})
export class AppModule {}

