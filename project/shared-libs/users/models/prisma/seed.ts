import { PrismaClient as PrismaClientUsers } from '../../../../node_modules/.prisma/client_users';

const USER_ID_1 = 'ab04593b-96a2-4fe3-bea6-e06d82e2efdd';
const USER_ID_2 = '6d308040-da99-4162-8b4b-2338e9976540';

const USER_ROLE_ID_1 = '6d308040-96a2-4fe3-bea6-2338e9976540';
const USER_ROLE_ID_2 = 'ab04593b-96a2-4fe3-bea6-e06d82e2efdd';

function getUsers() {
  return [
    {
      id: USER_ID_1,
      email: 'email_1@email.com',
      username: 'username_1',
      name: 'Name Surname 1',
      avatar: 'avatar_1.jpg',
      birthDate: '1990-01-01',
      role: 'admin',
    },
    {
      id: USER_ID_2,
      email: 'email_2@email.com',
      username: 'username_2',
      name: 'Name Surname 2',
      avatar: 'avatar_2.jpg',
      birthDate: '1990-02-02',
      role: 'user',
    },
  ];
}

async function seedDb(prismaClient: PrismaClientUsers) {
  const mockUsers = getUsers();
  for (const user of mockUsers) {
    await prismaClient.user.create({
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        birthDate: user.birthDate,
        role: user.role,
      }
    })
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClientUsers();

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
