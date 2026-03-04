import { Controller, Post } from "@nestjs/common";

@Controller()
class UsersController {
    @Post('users')
    async createUsers () {

    }
}

export default new UsersController;