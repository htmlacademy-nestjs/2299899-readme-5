import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/shared-libs/blog/models';

import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';

@Module({
  imports: [
    PrismaClientModule,
  ],
  providers: [
    TagRepository,
    TagService,
  ],
  exports: [
    TagService,
  ],
})
export class TagModule {}
