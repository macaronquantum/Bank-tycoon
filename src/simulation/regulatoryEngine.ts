import { PrismaClient } from '@prisma/client';

export async function runRegulatoryEngine(prisma: PrismaClient) {
  return prisma.$transaction(async (tx) => {
    const banks = await tx.bank.findMany({ include: { country: true } });
    let checks = 0;

    for (const bank of banks) {
      const capitalRatio = bank.capital / Math.max(1, bank.deposits);
      const liquidityRatio = bank.liquidity / Math.max(1, bank.deposits);

      if (capitalRatio < bank.country.capitalMin) {
        checks += 1;
        await tx.regulatoryCheck.create({
          data: {
            bankId: bank.id,
            countryId: bank.countryId,
            level: 2,
            message: `Capital ratio below threshold (${capitalRatio.toFixed(3)})`,
            penalty: 2,
          },
        });
      }

      if (liquidityRatio < bank.country.liquidityMin) {
        checks += 1;
        await tx.regulatoryCheck.create({
          data: {
            bankId: bank.id,
            countryId: bank.countryId,
            level: 3,
            message: `Liquidity ratio below threshold (${liquidityRatio.toFixed(3)})`,
            penalty: 3,
          },
        });
      }
    }

    await tx.auditLog.create({
      data: {
        action: 'SIM_regulatoryEngine',
        entity: 'SIM',
        entityId: 'core',
        payload: { checks, at: new Date().toISOString() },
      },
    });

    return { checks };
  });
}
