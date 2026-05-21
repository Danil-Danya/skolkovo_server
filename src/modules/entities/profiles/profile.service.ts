import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CreateProfileDTO, ProfileAnswerDTO, ProfileDTO, UpdateProfileDTO } from "./dto/profile.dto";
import { DeletedMessageDTO } from "src/core/dto/global.dto";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class ProfileService {
    constructor (private prisma: PrismaService) {}

    private normalizeCompanyIds (data: Pick<CreateProfileDTO | UpdateProfileDTO, "companyId" | "companyIds">): string[] | undefined {
        if (data.companyIds !== undefined) {
            return [...new Set(data.companyIds ?? [])];
        }

        if (data.companyId !== undefined) {
            return data.companyId ? [data.companyId] : [];
        }

        return undefined;
    }

    private async replaceProfileCompanies (tx: Prisma.TransactionClient, profileId: string, companyIds: string[]): Promise<void> {
        await tx.profile_companies.deleteMany({
            where: {
                profileId
            }
        });

        if (!companyIds.length) {
            return;
        }

        await tx.profile_companies.createMany({
            data: companyIds.map((companyId) => ({
                profileId,
                companyId
            }))
        });
    }

    private async getProfileCompanyIds (profileId: string): Promise<string[]> {
        const companyLinks = await this.prisma.profile_companies.findMany({
            where: {
                profileId
            },
            orderBy: {
                createdAt: "asc"
            },
            select: {
                companyId: true
            }
        });

        return companyLinks.map((companyLink) => companyLink.companyId);
    }

    private buildProfileAnswer (profile: Omit<ProfileDTO, "companyId" | "companyIds">, companyIds: string[]): ProfileAnswerDTO {
        return {
            ...profile,
            companyId: companyIds[0] ?? null,
            companyIds
        };
    }

    async createProfile (data: CreateProfileDTO): Promise<ProfileAnswerDTO> {
        const companyIds = this.normalizeCompanyIds(data) ?? [];
        const createdProfile = await this.prisma.$transaction(async (tx) => {
            const createdProfile = await tx.profiles.create({
                data: {
                    userId: data.userId,
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

            await this.replaceProfileCompanies(tx, createdProfile.id, companyIds);

            return createdProfile;
        });

        if (!createdProfile) {
            throw new InternalServerErrorException("Не получилось создать профиль");
        }

        return this.buildProfileAnswer(createdProfile, companyIds);
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

        const companyIds = await this.getProfileCompanyIds(profile.id);

        return this.buildProfileAnswer(profile, companyIds);
    }

    async updateProfile (id: string, data: UpdateProfileDTO): Promise<ProfileAnswerDTO> {
        const companyIds = this.normalizeCompanyIds(data);
        const updatedProfile = await this.prisma.$transaction(async (tx) => {
            const profile = await tx.profiles.findUnique({
                where: {
                    id
                }
            });

            if (!profile) {
                throw new NotFoundException("Профиль не был найден");
            }

            const updatedProfile = await tx.profiles.update({
                where: {
                    id
                },
                data: {
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

            if (companyIds !== undefined) {
                await this.replaceProfileCompanies(tx, id, companyIds);
            }

            return updatedProfile;
        });

        if (!updatedProfile) {
            throw new InternalServerErrorException("Не получилось обновить профиль");
        }

        if (companyIds !== undefined) {
            return this.buildProfileAnswer(updatedProfile, companyIds);
        }

        const currentCompanyIds = await this.getProfileCompanyIds(id);

        return this.buildProfileAnswer(updatedProfile, currentCompanyIds);
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