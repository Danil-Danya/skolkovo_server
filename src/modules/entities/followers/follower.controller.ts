import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { FollowersService } from "./follower.service";
import { CreateFollowerDTO, FollowerAnswerDTO } from "./dto/follower.dto";
import { DeletedMessageDTO } from "src/core/dto/global.dto";
import { Auth } from "src/modules/auth/decorators/auth.decorators";
import { ApiBasicAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Followers')
@Controller('followers')
export class FollowersController {
    constructor (private followersService: FollowersService) {}

    @Post()
    @Auth()
    @ApiOperation({ summary: "Создать нового подписчика" })
    @ApiBasicAuth()
    @ApiOkResponse({ type: FollowerAnswerDTO })
    async createFollower (@Body() data: CreateFollowerDTO): Promise<FollowerAnswerDTO> {
        const follower = await this.followersService.createFollower(data);
        return follower;
    }

    @Delete(':id')
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
}