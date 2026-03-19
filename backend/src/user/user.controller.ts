import { Controller, Get, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../auth/guard/jwt.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string, @Req() req: any) {
    // If frontend hardcodes '1', intercept it and return the logged-in user
    const userId = (id === '1' || id === 'me') ? req.user.id : parseInt(id, 10);
    const user = await this.userService.getUserById(userId);
    
    // Supplement with mock address to avoid frontend null errors since schema lacks address
    return {
       ...user,
       address: {
           street: '',
           city: '',
           state: '',
           zipCode: '',
           country: ''
       }
    };
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const userId = (id === '1' || id === 'me') ? req.user.id : parseInt(id, 10);
    return this.userService.updateUser(userId, body);
  }
}
