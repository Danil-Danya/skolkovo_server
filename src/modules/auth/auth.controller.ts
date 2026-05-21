import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserAnswerDTO, UserDTO } from "../entities/users/dto/users.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current_user.decorator";
import { Auth } from "./decorators/auth.decorators";
import { JWTRefreshGuard } from "./guards/jwt_refresh.guard";
import {
    AdminLoginDTO,
    LoginFromTelegramDTO,
    RefreshRequestUserDTO,
    TelegramBotRegisterAnswerDTO,
    TelegramBotRegisterDTO,
    TokenAnswerDTO
} from "./jwt/jwt.dto";

@ApiTags("Auth")
@Controller()
export class AuthController {
    constructor (private authService: AuthService) {}

    @Post(["login", "login/telegram"])
    @ApiOperation({ summary: "Авторизовать пользователя" })
    @ApiOkResponse({ type: TokenAnswerDTO })
    private async login (@Body() body: LoginFromTelegramDTO): Promise<TokenAnswerDTO> {
        return await this.authService.loginFromTelegram(body.auth);
    }

    @Post("login/admin")
    @ApiOperation({ summary: "Авторизовать администратора по tg username и паролю" })
    @ApiOkResponse({ type: TokenAnswerDTO })
    private async loginAdmin (@Body() body: AdminLoginDTO): Promise<TokenAnswerDTO> {
        return await this.authService.loginAdmin(body.tgUserName, body.password);
    }

    @Post("register/telegram")
    @ApiOperation({ summary: "Зарегистрировать пользователя из Telegram-бота" })
    @ApiOkResponse({ type: TelegramBotRegisterAnswerDTO })
    private async registerTelegramBot (@Body() body: TelegramBotRegisterDTO): Promise<TelegramBotRegisterAnswerDTO> {
        return await this.authService.registerTelegramBot(body);
    }

    @Post("refresh")
    @UseGuards(JWTRefreshGuard)
    @ApiOperation({ summary: "Обновить JWT токены" })
    @ApiOkResponse({ type: TokenAnswerDTO })
    private async refresh (@CurrentUser() user: RefreshRequestUserDTO): Promise<TokenAnswerDTO> {
        return await this.authService.generateJWTTokens({ id: user.id });
    }

    @Post("account/apply/:id")
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Активировать аккаунт пользователя" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: UserAnswerDTO })
    private async applyAccount (@Param("id") id: string): Promise<UserAnswerDTO> {
        return await this.authService.applyAccount(id);
    }

    @Post("account/ban/:id")
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Заблокировать аккаунт пользователя" })
    @ApiParam({ name: "id", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiOkResponse({ type: UserAnswerDTO })
    private async banAccount (@Param("id") id: string): Promise<UserAnswerDTO> {
        return await this.authService.banAccount(id);
    }

    @Get("me")
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить текущего пользователя" })
    private async getMe (@CurrentUser() user: UserDTO) {
        return await this.authService.getMe(user);
    }
}
