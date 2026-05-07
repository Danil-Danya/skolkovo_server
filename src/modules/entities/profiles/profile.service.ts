import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateProfileDTO, ProfileAnswerDTO, UpdateProfileDTO } from "./dto/profile.dto";
import { DeletedMessageDTO } from "src/core/dto/global.dto";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class ProfileService {
    constructor (private prisma: PrismaService) {}

    async createProfile (data: CreateProfileDTO): Promise<ProfileAnswerDTO> {
        const createdProfile = await this.prisma.profiles.create({
            data: {
                userId: data.userId,
                companyId: data.companyId,
                positionId: data.positionId,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                biography: data.biography,
                region: data.region,
                tgUser: data.tgUser,
                phone: data.phone,
                avatarPath: data.avatarPath
            }
        });

        if (!createdProfile) {
            throw new InternalServerErrorException("Не получилось создать профиль");
        }

        return createdProfile;
    }

    async getProfileById (id: string): Promise<ProfileAnswerDTO> {
        const profile = await this.prisma.profiles.findUnique({
            where: {
                id
            }
        });

        if (!profile) {
            throw new NotFoundException("Профиль не был найден");
        }

        return profile;
    }

    async updateProfile (id: string, data: UpdateProfileDTO): Promise<ProfileAnswerDTO> {
        const profile = await this.prisma.profiles.findUnique({
            where: {
                id
            }
        });

        if (!profile) {
            throw new NotFoundException("Профиль не был найден");
        }

        const updatedProfile = await this.prisma.profiles.update({
            where: {
                id
            },
            data: {
                companyId: data.companyId,
                positionId: data.positionId,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                biography: data.biography,
                region: data.region,
                tgUser: data.tgUser,
                phone: data.phone,
                avatarPath: data.avatarPath
            }
        });

        if (!updatedProfile) {
            throw new InternalServerErrorException("Не получилось обновить профиль");
        }

        return updatedProfile;
    }

    async deleteProfile (id: string): Promise<DeletedMessageDTO> {
        const profile = await this.prisma.profiles.findUnique({
            where: {
                id
            }
        });

        if (!profile) {
            throw new NotFoundException("Профиль не был найден");
        }

        await this.prisma.profiles.delete({
            where: {
                id
            }
        });

        return {
            message: "Профиль был успешно удален"
        };
    }
}
