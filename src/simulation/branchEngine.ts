import { PrismaClient } from '@prisma/client';

export async function runBranchEngine(prisma: PrismaClient) {
  return prisma.$transaction(async (tx) => {
    const branches = await tx.branch.findMany({ include: { district: true } });

    for (const branch of branches) {
      const demand = branch.district.depositPotential + branch.district.loanPotential;
      const competitionPenalty = branch.district.competition * 0.2;
      const delta = demand - competitionPenalty;

      await tx.branch.update({
        where: { id: branch.id },
        data: {
          satisfaction: Math.max(20, Math.min(100, branch.satisfaction + delta * 0.3)),
          localReputation: Math.max(15, Math.min(100, branch.localReputation + delta * 0.25)),
        },
      });
    }

    await tx.auditLog.create({
      data: {
        action: 'SIM_branchEngine',
        entity: 'SIM',
        entityId: 'core',
        payload: { branchesTouched: branches.length, at: new Date().toISOString() },
      },
    });

    return { branchesTouched: branches.length };
  });
}
