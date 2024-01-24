import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '@project/core';
import { fillDto } from '@project/helpers';
import { RequestWithTokenPayload } from '@project/types';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentAuthorGuard } from './guards/comment-author.guard';
import { CommentQuery } from './query/comment.query';
import { CommentRdo } from './rdo/comment.rdo';
import { CommentsPaginationRdo } from './rdo/comments-pagination.rdo';

@Controller('posts/:id/comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @Get('/')
  public async show(@Param('id') postId: string, @Query() query: CommentQuery) {
    const commentsPagination = await this.commentService.getComments(postId, query);
    const result = {
      ...commentsPagination,
      entities: commentsPagination.entities.map((comment) => fillDto(CommentRdo, comment.toPOJO())),
    }
    return fillDto(CommentsPaginationRdo, result);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  public async create(@Param('id') postId: string, @Body() dto: CreateCommentDto, @Req() { user }: RequestWithTokenPayload) {
    const newComment = await this.commentService.createComment(postId, user.userId, dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CommentAuthorGuard)
  @UseGuards(JwtAuthGuard)
  public async destroy(@Param('id') id: string) {
    await this.commentService.deleteComment(id);
  }
}
