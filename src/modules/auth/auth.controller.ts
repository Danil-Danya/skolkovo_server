import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserDTO } from "../entities/users/dto/users.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current_user.decorator";
import { Auth } from "./decorators/auth.decorators";
import { JWTRefreshGuard } from "./guards/jwt_refresh.guard";
import { LoginFromTelegramDTO, RefreshRequestUserDTO, TokenAnswerDTO } from "./jwt/jwt.dto";

@ApiTags("Auth")
@Controller()
export class AuthController {
    constructor (private authService: AuthService) {}

    @Post(['login', 'login/telegram'])
    @ApiOperation({ summary: "Авторизовать пользователя" })
    @ApiOkResponse({ type: TokenAnswerDTO })
    private async login (@Body() body: LoginFromTelegramDTO): Promise<TokenAnswerDTO> {
        const tokens = await this.authService.loginFromTelegram(body.auth);
        return tokens;
    }

    @Post('refresh')
    @UseGuards(JWTRefreshGuard)
    @ApiOperation({ summary: "Обновить JWT токены" })
    @ApiOkResponse({ type: TokenAnswerDTO })
    private async refresh (@CurrentUser() user: RefreshRequestUserDTO): Promise<TokenAnswerDTO> {
        const tokens = await this.authService.generateJWTTokens({ id: user.id });
        return tokens;
    }

    @Get('me')
    @Auth()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Получить текущего пользователя" })
    private async getMe (@CurrentUser() user: UserDTO) {
        const fullProfile = await this.authService.getMe(user);
        return fullProfile;
    }
}
