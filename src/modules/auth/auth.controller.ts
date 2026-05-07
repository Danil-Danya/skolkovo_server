import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserDTO } from "../entities/users/dto/users.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current_user.decorator";
import { JWTRefreshGuard } from "./guards/jwt_refresh.guard";
import {
    AdminLoginDTO,
    LoginFromTelegramDTO,
    RefreshRequestUserDTO,
    TelegramBotRegisterAnswerDTO,
    TelegramBotRegisterDTO,
    TokenAnswerDTO
} from "./jwt/jwt.dto";
import { Auth } from "./decorators/auth.decorators";

@ApiTags("Auth")
@Controller()
export class AuthController {
    constructor (private authService: AuthService) {}

    @Post(["login", "login/telegram"])
    @ApiOperation({ summary: "Авторизовать пользователя" })
    @ApiOkResponse({ type: TokenAnswerDTO })
    private async login (@Body() body: LoginFromTelegramDTO): Promise<TokenAnswerDTO> {
        const tokens = await this.authService.loginFromTelegram(body.auth);
        return tokens;
    }

    @Post("login/admin")
    @ApiOperation({ summary: "Авторизовать администратора по tg username и паролю" })
    @ApiOkResponse({ type: TokenAnswerDTO })
    private async loginAdmin (@Body() body: AdminLoginDTO): Promise<TokenAnswerDTO> {
        const tokens = await this.authService.loginAdmin(body.tgUserName, body.password);
        return tokens;
    }

    @Post("register/telegram")
    @ApiOperation({ summary: "Зарегистрировать пользователя из Telegram-бота" })
    @ApiOkResponse({ type: TelegramBotRegisterAnswerDTO })
    private async registerTelegramBot (@Body() body: TelegramBotRegisterDTO): Promise<TelegramBotRegisterAnswerDTO> {
        const registration = await this.authService.registerTelegramBot(body);
        return registration;
    }

    @Post("refresh")
    @UseGuards(JWTRefreshGuard)
    @ApiOperation({ summary: "Обновить JWT токены" })
    @ApiOkResponse({ type: TokenAnswerDTO })
    private async refresh (@CurrentUser() user: RefreshRequestUserDTO): Promise<TokenAnswerDTO> {
        const tokens = await this.authService.generateJWTTokens({ id: user.id });
        return tokens;
    }

    // @Post('account/apply/:id')
    // @Auth()
    // @ApiBearerAuth()
    // @ApiOperation({ summary: "Принять текущего пользователя в систему" })
    // private async applyAccount () {

    // }

    // @Post('account/ban/:id')
    // @Auth()
    // @ApiBearerAuth()
    // @ApiOperation({ summary: "Принять текущего пользователя в систему" })
    // private async applyAccount () {
        
    // }

    @Get("me")
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить текущего пользователя" })
    private async getMe (@CurrentUser() user: UserDTO) {
        const fullProfile = await this.authService.getMe(user);
        return fullProfile;
    }
}
