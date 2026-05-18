import { PrismaClient } from '@prisma/client';

export async function runSnapshotEngine(prisma: PrismaClient) {
  return prisma.$transaction(async (tx) => {
    const banks = await tx.bank.findMany();

    for (const bank of banks) {
      const value = bank.capital + bank.deposits * 0.2 + bank.liquidity;
      await tx.bankSnapshot.create({
        data: {
          bankId: bank.id,
          value,
          capital: bank.capital,
          deposits: bank.deposits,
          liquidity: bank.liquidity,
          profit: bank.deposits * 0.01,
          reputation: bank.reputation,
        },
      });
    }

    await tx.auditLog.create({
      data: {
        action: 'SIM_snapshotEngine',
        entity: 'SIM',
        entityId: 'core',
        payload: { snapshots: banks.length, at: new Date().toISOString() },
      },
    });

    return { snapshots: banks.length };
  });
}
