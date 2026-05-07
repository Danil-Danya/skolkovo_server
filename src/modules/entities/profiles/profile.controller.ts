import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UploadFile } from "src/core/decorators/upload_file.decorator";
import { ProfileService } from "./profile.service";
import type { UploadedStaticFile } from "src/core/types/files.type";
import {
    CreateProfileDTO,
    CreateProfileWithAvatarDTO,
    ProfileAnswerDTO,
    UpdateProfileDTO,
    UpdateProfileWithAvatarDTO
} from "./dto/profile.dto";
import { DeletedMessageDTO } from "src/core/dto/global.dto";
import { Auth } from "src/modules/auth/decorators/auth.decorators";

@ApiTags("Profiles")
@Controller('profile')
export class ProfileController {
    constructor (private profileService: ProfileService) {}

    @Post()
    //@Auth()
    @ApiBearerAuth()
    @UploadFile('avatar', 'avatars')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: "Создать профиль" })
    @ApiBody({ type: CreateProfileWithAvatarDTO })
    @ApiOkResponse({ type: ProfileAnswerDTO })
    private async create (
        @Body() data: CreateProfileWithAvatarDTO, 
        @UploadedFile() avatar?: UploadedStaticFile
    ): Promise<ProfileAnswerDTO> {
        const { avatar: _, ...profileData } = data;

        const createdProfile = await this.profileService.createProfile({
            ...profileData,
            avatarPath: avatar?.url ?? data.avatarPath
        } as CreateProfileDTO);
        return createdProfile;
    }

    @Get(':id')
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить профиль по id" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: ProfileAnswerDTO })
    private async getById (@Param("id") id: string): Promise<ProfileAnswerDTO> {
        const profile = await this.profileService.getProfileById(id);
        return profile;
    }

    @Put(':id')
    //@Auth()
    @ApiBearerAuth()
    @UploadFile('avatar', 'avatars')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: "Обновить профиль" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiBody({ type: UpdateProfileWithAvatarDTO })
    @ApiOkResponse({ type: ProfileAnswerDTO })
    private async update (
        @Param("id") id: string, 
        @Body() data: UpdateProfileWithAvatarDTO, 
        @UploadedFile() avatar?: UploadedStaticFile
    ): Promise<ProfileAnswerDTO> {
        const { avatar: _, ...profileData } = data;

        const updatedProfile = await this.profileService.updateProfile(id, {
            ...profileData,
            avatarPath: avatar?.url ?? data.avatarPath
        } as UpdateProfileDTO);
        return updatedProfile;
    }

    @Delete(':id')
    //@Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Удалить профиль" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: DeletedMessageDTO })
    private async delete (@Param("id") id: string): Promise<DeletedMessageDTO> {
        const deletedProfile = await this.profileService.deleteProfile(id);
        return deletedProfile;
    }
}
