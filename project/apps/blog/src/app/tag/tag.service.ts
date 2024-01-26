import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './tag.entity';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
  ) {}

  public async getTag(id: string): Promise<TagEntity> {
    return this.tagRepository.findById(id);
  }

  public async createTag(dto: CreateTagDto): Promise<TagEntity> {
    return this.tagRepository.findOneOrCreate(dto.title);
  }

  public async createTags(tagsDto: CreateTagDto[]): Promise<TagEntity[]> {
    return this.tagRepository.findOrCreate(tagsDto.map((dto) => dto.title));
  }

  public async deleteTag(id: string): Promise<void> {
    try {
      await this.tagRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Post tag with id ${id} not found`);
    }
  }

  public async updateTag(id: string, dto: UpdateTagDto): Promise<TagEntity> {
    const tagEntity = new TagEntity(dto);

    try {
      const updatedTag = await this.tagRepository.update(id, tagEntity);
      return updatedTag;
    } catch {
      throw new NotFoundException(`Post tag with id ${id} not found`);
    }
  }
}
