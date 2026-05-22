import { Module } from "@nestjs/common";
import { FollowersController } from "./follower.controller";
import { FollowersService } from "./follower.service";
import { NotificationModule } from "../notificatations/notification.module";

@Module({
    imports: [NotificationModule],
    controllers: [FollowersController],
    providers: [FollowersService],
    exports: [FollowersService]
})
export class FollowersModule {}
