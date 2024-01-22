import { v4 as uuidv4 } from 'uuid';

import { PrismaClient } from '@prisma/client';

const TYPE_TITLES = ['Видео', 'Текст', 'Цитата', 'Фото', 'Ссылка'];

const MOCK_USER_IDS = ['65aeb270b4b011262dfa6ca5', '65aeb275b4b011262dfa6ca9'];

function getMockTypes() {
  return TYPE_TITLES.map((title) => ({ id: uuidv4(), title }));
}

function getMockPosts(mockTypes: Record<string, string>[]) {
  const posts: Record<string, string | any>[] = [];

  for (let i = 1; i < 27; ++i) {
    posts.push({
      id: uuidv4(),
      title: `Title_${i}`,
      url: `url_${i}`,
      photo: `photo_${i}`,
      anons: `anons_${i}`,
      content: `content_${i}`,
      tags: ['tag_1', 'tag_2'],
      userId: MOCK_USER_IDS[Math.floor(Math.random() * MOCK_USER_IDS.length)],
      description: `Description_${i}.`,
      type: { connect: { id: mockTypes[Math.floor(Math.random() * mockTypes.length)].id } },
    });
  }

  return posts;
}

async function seedDb(prismaClient: PrismaClient) {
  const mockTypes = getMockTypes();
  for (const type of mockTypes) {
    await prismaClient.type.upsert({
      where: { id: type.id },
      update: {},
      create: {
        id: type.id,
        title: type.title
      }
    });
  }

  const mockPosts = getMockPosts(mockTypes);
  for (const post of mockPosts) {
    await prismaClient.post.create({
      data: {
        id: post.id,
        type: post.type,
        title: post.title,
        url: post.url,
        photo: post.photo,
        anons: post.anons,
        content: post.content,
        tags: post.tags,
        userId: post.userId,
        comments: post.comments ? {
          create: post.comments
        } : undefined,
      }
    })
  }

  console.info('🤘️ Database readme_blog was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
