import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CreatePostTypeDto } from './dto/create-post-type.dto';
import { UpdatePostTypeDto } from './dto/update-post-type.dto';
import { PostTypeEntity } from './post-type.entity';
import { PostTypeRepository } from './post-type.repository';

@Injectable()
export class PostTypeService {
  constructor(
    private readonly postTypeRepository: PostTypeRepository,
  ) {}

  public async getPostType(id: string): Promise<PostTypeEntity> {
    return this.postTypeRepository.findById(id);
  }

  public async getAllPostTypes(): Promise<PostTypeEntity[]> {
    return await this.postTypeRepository.find();
  }

  public async createPostType(dto: CreatePostTypeDto): Promise<PostTypeEntity> {
    const postTypeExists = (await this.postTypeRepository.find({ title: dto.title })).at(0);
    if (postTypeExists) throw new ConflictException('Post type with this title already exists');

    const newPostType = new PostTypeEntity(dto);
    await this.postTypeRepository.save(newPostType);

    return newPostType;
  }

  public async deletePostType(id: string): Promise<void> {
    try {
      await this.postTypeRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Post type with id ${id} not found`);
    }
  }

  public async updatePostType(id: string, dto: UpdatePostTypeDto): Promise<PostTypeEntity> {
    const postTypeEntity = new PostTypeEntity(dto);

    try {
      const updatedPostType = await this.postTypeRepository.update(id, postTypeEntity);
      return updatedPostType;
    } catch {
      throw new NotFoundException(`Post type with id ${id} not found`);
    }
  }

  public async getPostTypesByIds(postTypesIds: string[]): Promise<PostTypeEntity[]> {
    const postTypes = await this.postTypeRepository.findByIds(postTypesIds);

    if (postTypes.length !== postTypesIds.length) {
      const foundPostTypesIds = postTypes.map((postType) => postType.id);
      const notFoundPostTypesIds = postTypesIds.filter((postTypeId) => !foundPostTypesIds.includes(postTypeId));

      if (notFoundPostTypesIds.length > 0) throw new NotFoundException(`Post types with ids ${notFoundPostTypesIds.join(', ')} not found`);
    }

    return postTypes;
  }
}
