import { PrismaClient } from '@prisma/client';

const GROWTH_FACTOR_MIN = 0.006;
const GROWTH_FACTOR_MAX = 0.03;

export async function runClientGrowthEngine(prisma: PrismaClient) {
  return prisma.$transaction(async (tx) => {
    const branches = await tx.branch.findMany({
      include: {
        district: true,
        cohorts: true,
      },
    });

    let grownClients = 0;

    for (const branch of branches) {
      const regionGrowth = Math.max(branch.district.depositPotential, 0.1);
      const branchMultiplier = 1 + branch.satisfaction / 250 + branch.localReputation / 300;

      for (const cohort of branch.cohorts) {
        const growthFactor = Math.min(
          GROWTH_FACTOR_MAX,
          Math.max(GROWTH_FACTOR_MIN, cohort.creditDemandProb * 0.05),
        );

        const growthClients = Math.max(
          0,
          Math.floor(cohort.clients * growthFactor * regionGrowth * branchMultiplier),
        );

        if (growthClients === 0) {
          continue;
        }

        grownClients += growthClients;

        await tx.customerCohort.update({
          where: { id: cohort.id },
          data: { clients: cohort.clients + growthClients },
        });
      }
    }

    await tx.auditLog.create({
      data: {
        action: 'SIM_clientGrowthEngine',
        entity: 'SIM',
        entityId: 'core',
        payload: { grownClients, at: new Date().toISOString() },
      },
    });

    return { grownClients };
  });
}
