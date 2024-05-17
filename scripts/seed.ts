// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        {
          name: 'Computer Science',
        },
        {
          name: 'Music',
        },
        {
          name: 'Fitness',
        },
        {
          name: 'Photography',
        },
        {
          name: 'Accounting',
        },
        {
          name: 'Engineering',
        },
        {
          name: 'Filming',
        },
      ],
    });

    await database.fee.createMany({
      data: [
        { amount: 0, method: 'percentage', rate: 2.9, name: 'Stripe Processing Fee' },
        { amount: 30, method: 'fixed', rate: 0, name: 'Stripe Transaction Fee' },
        { amount: 0, method: 'percentage', rate: 5, name: 'Nova LMS Service Fee' },
      ],
    });

    await database.configuration.createMany({
      data: [
        {
          authFlowJson: JSON.stringify({
            google: true,
            yandex: true,
            vk: true,
            mailru: false,
            linkedin: false,
            slack: false,
            github: true,
          }),
        },
      ],
    });

    console.info('Success');
  } catch (error) {
    console.error('Error seeding the database categories', error);
  } finally {
    await database.$disconnect();
  }
}

main();
