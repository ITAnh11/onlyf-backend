import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post('create')
  async createPost(@Request() req, @Body() data: any) {
    return this.postService.createPost(req, data);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-my-posts')
  async getMyPosts(@Request() req, @Query() query: any) {
    // Logic to get a post
    return this.postService.getMyPosts(req, query);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Delete('delete')
  async deletePost(@Request() req, @Query() query: any) {
    return this.postService.deletePost(req, query);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('get-posts')
  async getPosts(@Request() req, @Query() query: any) {
    return this.postService.getPosts(req, query);
  }
}
