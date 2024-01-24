import { v4 as uuidv4 } from 'uuid';

import { PrismaClient } from '@prisma/client';

const TYPE_TITLES = ['Видео', 'Текст', 'Цитата', 'Фото', 'Ссылка'];
const MOCK_USER_IDS = ['65aeb270b4b011262dfa6ca5', '65aeb275b4b011262dfa6ca9'];
const MOCK_TAGS = ['tag_1', 'tag_2', 'tag_3'];
const STATUSES = ['Опубликована', 'Черновик'];

function getMockTypes() {
  return TYPE_TITLES.map((title) => ({ id: uuidv4(), title }));
}

function getMockTags() {
  return MOCK_TAGS.map((title) => ({ id: uuidv4(), title }));
}

function getMockPosts(mockTags: Record<string, string>[]) {
  const posts: Record<string, string | any>[] = [];

  for (let i = 1; i < 27; ++i) {
    const type = TYPE_TITLES[Math.floor(Math.random() * TYPE_TITLES.length)];
    posts.push({
      id: uuidv4(),
      type,
      videoTitle: type === 'Видео' ? `video_title_${i}` : undefined,
      videoUrl: type === 'Видео' ? `video_url_${i}` : undefined,
      textTitle: type === 'Текст' ? `text_title_${i}` : undefined,
      textAnons: type === 'Текст' ? `text_anons_${i}` : undefined,
      text: type === 'Текст' ? `text_content_${i}` : undefined,
      cite: type === 'Цитата' ? `cite_${i}` : undefined,
      citeAuthor: type === 'Цитата' ? `cite_author_${i}` : undefined,
      photo: type === 'Фото' ? `photo_file_path_${i}` : undefined,
      url: type === 'Ссылка' ? `url_${i}` : undefined,
      urlDescription: type === 'Ссылка' ? `url_description_${i}` : undefined,
      userId: MOCK_USER_IDS[Math.floor(Math.random() * MOCK_USER_IDS.length)],
      tags: [mockTags[Math.floor(Math.random() * mockTags.length)].id],
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    });
  }

  return posts;
}

async function seedDb(prismaClient: PrismaClient) {
  const mockTypes = getMockTypes();
  const mockTags = getMockTags();

  for (const tag of mockTags) {
    await prismaClient.tag.upsert({
      where: { id: tag.id },
      update: {},
      create: {
        id: tag.id,
        title: tag.title
      }
    });
  }

  const mockPosts = getMockPosts(mockTypes);
  for (const post of mockPosts) {
    await prismaClient.post.create({
      data: {
        id: post.id,
        type: post.type,
        videoTitle: post.videoTitle,
        videoUrl: post.videoUrl,
        textTitle: post.textTitle,
        textAnons: post.textAnons,
        text: post.text,
        cite: post.cite,
        citeAuthor: post.citeAuthor,
        photo: post.photo,
        url: post.url,
        urlDescription: post.urlDescription,
        userId: post.userId,
        status: post.status,
        // tags: post.tags.length ? {
        //   create: post.tags,
        // } : undefined,
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
