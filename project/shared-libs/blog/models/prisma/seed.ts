import { PrismaClient } from '@prisma/client';

const TYPE_UUID_1 = '39614113-7ad5-45b6-8093-06455437e1e2';
const TYPE_UUID_2 = 'efd775e2-df55-4e0e-a308-58249f5ea202';
const TYPE_UUID_3 = '39614113-df55-45b6-a308-06455437e1e2';
const TYPE_UUID_4 = 'efd775e2-df55-4e0e-a308-58249f5ea202';

const POST_UUID_1 = '6d308040-96a2-4162-bea6-2338e9976540';
const POST_UUID_2 = 'ab04593b-da99-4fe3-8b4b-e06d82e2efdd';

const USER_ID_1 = '658170cbb954e9f5b905ccf4';
const USER_ID_2 = '6581762309c030b503e30512';

function getTypes() {
  return [
    { id: TYPE_UUID_1, title: 'Текст' },
    { id: TYPE_UUID_2, title: 'Цитата' },
    { id: TYPE_UUID_3, title: 'Фото' },
    { id: TYPE_UUID_4, title: 'Ссылка' },
  ];
}

function getPosts() {
  return [
    {
      id: POST_UUID_1,
      title: 'Худеющий',
      url: 'url_1',
      photo: 'photo_1',
      anons: 'anons_1',
      content: 'content_1',
      tags: ['tag_1', 'tag_2'],
      userId: USER_ID_1,
      description: 'На мой взгляд, это один из самых страшных романов Стивена Кинга.',
      type: {
        connect: [{ id: TYPE_UUID_1 }],
      },
    },
    {
      id: POST_UUID_2,
      title: 'Худеющий_2',
      url: 'url_2',
      photo: 'photo_2',
      anons: 'anons_2',
      content: 'content_2',
      tags: ['tag_3'],
      userId: USER_ID_2,
      description: 'description_2',
      type: {
        connect: [
          { id: TYPE_UUID_2 },
          { id: TYPE_UUID_3 },
        ],
      },
      comments: [
          {
            message: 'Это действительно отличная книга!',
            userId: USER_ID_1,
          },
          {
            message: 'Надо будет обязательно перечитать. Слишком много информации.',
            userId: USER_ID_2,
          }
      ]
    }
  ]
}

async function seedDb(prismaClient: PrismaClient) {
  const mockTypes = getTypes();
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

  const mockPosts = getPosts();
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

  console.info('🤘️ Database was filled');
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
