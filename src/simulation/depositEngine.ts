import { PrismaClient } from '@prisma/client';

export async function runDepositEngine(prisma: PrismaClient) {
  return prisma.$transaction(async (tx) => {
    const branches = await tx.branch.findMany({
      include: { cohorts: true, bank: true },
    });

    let totalDeposits = 0;

    for (const branch of branches) {
      const generated = branch.cohorts.reduce((sum, cohort) => {
        const volatility = 1 - Math.min(0.9, cohort.depositVolatility);
        const recurring = cohort.clients * cohort.recurringDeposit;
        return sum + recurring * volatility;
      }, 0);

      if (generated <= 0) {
        continue;
      }

      totalDeposits += generated;

      await tx.branch.update({
        where: { id: branch.id },
        data: {
          deposits: { increment: generated },
          profitability: { increment: generated * 0.002 },
        },
      });

      await tx.bank.update({
        where: { id: branch.bankId },
        data: {
          deposits: { increment: generated },
          liquidity: { increment: generated * 0.82 },
        },
      });

      await tx.transactionLedger.create({
        data: {
          bankId: branch.bankId,
          type: 'DEPOSIT_INFLOW',
          amount: generated,
          metadata: {
            branchId: branch.id,
            cohorts: branch.cohorts.length,
          },
        },
      });
    }

    await tx.auditLog.create({
      data: {
        action: 'SIM_depositEngine',
        entity: 'SIM',
        entityId: 'core',
        payload: { totalDeposits, at: new Date().toISOString() },
      },
    });

    return { totalDeposits };
  });
}
