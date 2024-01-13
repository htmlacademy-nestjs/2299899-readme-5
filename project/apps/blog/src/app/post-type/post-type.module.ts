import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/shared-libs/blog/models';

import { PostTypeController } from './post-type.controller';
import { PostTypeRepository } from './post-type.repository';
import { PostTypeService } from './post-type.service';

@Module({
  imports: [PrismaClientModule],
  providers: [PostTypeRepository, PostTypeService],
  controllers: [PostTypeController],
  exports: [PostTypeService],
})
export class PostTypeModule {}
