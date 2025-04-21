import { Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ReactService } from './react.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('react')
export class ReactController {
  constructor(private readonly reactService: ReactService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-reacts-by-post-id')
  async getReactsByPostId(@Query('postId') postId: number) {
    return this.reactService.getReactsByPostId(postId);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('create')
  async createReact(@Request() req) {
    return this.reactService.createReact(req);
  }
}
