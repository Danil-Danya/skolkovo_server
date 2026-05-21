import { Module } from "@nestjs/common";
import { FollowersController } from "./follower.controller";
import { FollowersService } from "./follower.service";

@Module({
    controllers: [FollowersController],
    providers: [FollowersService],
    exports: [FollowersService]
})
export class FollowersModule {}