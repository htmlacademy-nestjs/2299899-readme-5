import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post
} from '@nestjs/common';
import { fillDto } from '@project/helpers';

import { CreatePostTypeDto } from './dto/create-post-type.dto';
import { UpdatePostTypeDto } from './dto/update-post-type.dto';
import { PostTypeService } from './post-type.service';
import { PostTypeRdo } from './rdo/post-type.rdo';

@Controller('post_types')
export class PostTypeController {
  constructor(
    private readonly postTypeService: PostTypeService,
  ) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    return this.postTypeService.getPostType(id);
  }

  @Get('/')
  public async index() {
    const postTypeEntities = await this.postTypeService.getAllPostTypes();
    const postTypes = postTypeEntities.map((postType) => postType.toPOJO());
    return fillDto(PostTypeRdo, postTypes);
  }

  @Post('/')
  public async create(@Body() dto: CreatePostTypeDto) {
    const newPostType = await this.postTypeService.createPostType(dto);
    return fillDto(PostTypeRdo, newPostType.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string) {
    await this.postTypeService.deletePostType(id);
  }

  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() dto: UpdatePostTypeDto) {
    const updatedPostType = await this.postTypeService.updatePostType(id, dto);
    return fillDto(PostTypeRdo, updatedPostType.toPOJO());
  }
}
