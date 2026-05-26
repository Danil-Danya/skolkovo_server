import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UnauthorizedException } from "@nestjs/common";
import { FollowersService } from "./follower.service";
import { CreateFollowerDTO, FollowerAnswerDTO, FollowerBotDecisionDTO } from "./dto/follower.dto";
import { DeletedMessageDTO, PaginateDTO } from "src/core/dto/global.dto";
import { Auth } from "src/modules/auth/decorators/auth.decorators";
import { CurrentUser } from "src/modules/auth/decorators/current_user.decorator";
import { ApiBasicAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Followers')
@Controller('followers')
export class FollowersController {
    constructor (private followersService: FollowersService) {}

    @Post('/follow')
    @Auth()
    @ApiOperation({ summary: "Создать нового подписчика" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: FollowerAnswerDTO })
    async createFollower (
        @CurrentUser() user: { id: string },
        @Body() data: CreateFollowerDTO
    ): Promise<FollowerAnswerDTO> {
        const follower = await this.followersService.createFollower({
            ...data,
            followerId: user.id
        });
        return follower;
    }

    @Delete('/unfollow/:id')
    @Auth()
    @ApiOperation({ summary: "Удалить подписчика" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: DeletedMessageDTO })
    async deleteFollower (@Param('id') id: string): Promise<DeletedMessageDTO> {
        const deletedMessage = await this.followersService.deleteFollower(id);
        return deletedMessage;
    }

    @Put(':id/status')
    @Auth()
    @ApiOperation({ summary: "Обновить статус подписчика" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: FollowerAnswerDTO })
    async updateStatusFollower (
        @Param('id') id: string,
        @Body('status') status: string
    ): Promise<FollowerAnswerDTO> {
        const updatedFollower = await this.followersService.updateStatusFollower(id, status);
        return updatedFollower;
    }

    @Post("bot-answer")
    @ApiOperation({ summary: "Ответить на запрос подписки из Telegram-бота" })
    @ApiOkResponse({ type: FollowerAnswerDTO })
    async answerFollowerFromBot (
        @Headers("authorization") authorization: string | undefined,
        @Body() data: FollowerBotDecisionDTO
    ): Promise<FollowerAnswerDTO> {
        this.validateBotToken(authorization);

        const follower = await this.followersService.answerFollowerRequest(data.id, data.status);
        return follower;
    }

    private validateBotToken (authorization?: string) {
        const token = authorization?.replace(/^Bearer\s+/i, "").trim();
        const expectedToken = process.env.SERVER_API_TOKEN;

        if (!expectedToken || token !== expectedToken) {
            throw new UnauthorizedException("Недостаточно прав для bot integration");
        }
    }

    @Get('/user/:userId/followers')
    @Auth()
    @ApiOperation({ summary: "Получить список подписчиков пользователя" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: [FollowerAnswerDTO] })
    async getUserFollowers (@Param('userId') userId: string, @Query() paginate: PaginateDTO) {
        const followers = await this.followersService.getUserFollowers(userId, paginate);
        return followers;
    }

    @Get('/user/:userId/followings')
    @Auth()
    @ApiOperation({ summary: "Получить список подписок пользователя" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: [FollowerAnswerDTO] })
    async getUserFollowings (@Param('userId') userId: string, @Query() paginate: PaginateDTO) {
        const followings = await this.followersService.getUserFollowings(userId, paginate);
        return followings;
    }

    @Get('/my/followers')
    @Auth()
    @ApiOperation({ summary: "Получить список ваших подписчиков" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: [FollowerAnswerDTO] })
    async getMyFollowers (@CurrentUser() user: { id: string }, @Query() paginate: PaginateDTO) {
        const followers = await this.followersService.getUserFollowers(user.id, paginate);
        return followers;
    }

    @Get('/my/followings')
    @Auth()
    @ApiOperation({ summary: "Получить список ваших подписок" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: [FollowerAnswerDTO] })
    async getMyFollowings (@CurrentUser() user: { id: string }, @Query() paginate: PaginateDTO) {
        const followings = await this.followersService.getUserFollowings(user.id, paginate);
        return followings;
    }
}
