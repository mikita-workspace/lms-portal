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

    await database.authFlow.createMany({
      data: [
        { isActive: true, provider: 'google' },
        { isActive: true, provider: 'yandex' },
        { isActive: true, provider: 'vk' },
        { isActive: false, provider: 'mailru' },
        { isActive: false, provider: 'linkedin' },
        { isActive: false, provider: 'slack' },
        { isActive: true, provider: 'github' },
      ],
    });

    await database.stripeSubscriptionDescription.createMany({
      data: [
        {
          period: 'monthly',
          points: ['Unlock premium courses', 'Get access to Nova AI', 'Cancel anytime'],
          price: 4900,
        },
        {
          period: 'yearly',
          points: ['Unlock premium courses', 'Get access to Nova AI', 'Cancel anytime'],
          price: 2400,
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
