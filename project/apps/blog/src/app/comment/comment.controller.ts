import {
    Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@project/core';
import { fillDto } from '@project/helpers';
import { RequestWithTokenPayload } from '@project/types';

import { API_AUTH_HEADER, CommentApiMessage } from './comment.const';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentAuthorGuard } from './guards/comment-author.guard';
import { CommentQuery } from './query/comment.query';
import { CommentRdo } from './rdo/comment.rdo';
import { CommentsPaginationRdo } from './rdo/comments-pagination.rdo';

@ApiTags('comments')
@Controller('posts/:id/comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @ApiResponse({ status: HttpStatus.OK, description: CommentApiMessage.ReadComments })
  @Get('/')
  public async show(@Param('id') postId: string, @Query() query: CommentQuery) {
    const commentsPagination = await this.commentService.getComments(postId, query);
    const result = {
      ...commentsPagination,
      entities: commentsPagination.entities.map((comment) => fillDto(CommentRdo, comment.toPOJO())),
    }
    return fillDto(CommentsPaginationRdo, result);
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.CREATED, description: CommentApiMessage.CommentCreate })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: CommentApiMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: CommentApiMessage.ValidationFailed })
  @Post('/')
  @UseGuards(JwtAuthGuard)
  public async create(@Param('id') postId: string, @Body() dto: CreateCommentDto, @Req() { user }: RequestWithTokenPayload) {
    const newComment = await this.commentService.createComment(postId, user.userId, dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }

  @ApiHeader(API_AUTH_HEADER)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: CommentApiMessage.CommentDelete })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: CommentApiMessage.CommentNotFound })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: CommentApiMessage.CommentForbidden })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CommentAuthorGuard)
  @UseGuards(JwtAuthGuard)
  public async destroy(@Param('id') id: string) {
    await this.commentService.deleteComment(id);
  }
}
