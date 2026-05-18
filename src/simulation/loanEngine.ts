import { PrismaClient } from '@prisma/client';

function shouldApprove(score: number, estDefault: number, proposedRate: number, minRate: number) {
  return score >= 0.55 && estDefault <= 0.2 && proposedRate >= minRate;
}

export async function runLoanEngine(prisma: PrismaClient) {
  return prisma.$transaction(async (tx) => {
    const pending = await tx.loanApplication.findMany({
      where: { decision: 'PENDING' },
      include: { bank: true },
      orderBy: { createdAt: 'asc' },
      take: 150,
    });

    let approved = 0;
    let rejected = 0;

    for (const app of pending) {
      const liquidCoverage = app.bank.liquidity / Math.max(1, app.amount);
      const accepted = shouldApprove(app.score, app.estimatedDefault, app.proposedRate, app.minRate) && liquidCoverage >= 0.35;

      if (!accepted) {
        rejected += 1;
        await tx.loanApplication.update({
          where: { id: app.id },
          data: { decision: 'REJECTED' },
        });
        continue;
      }

      approved += 1;

      const nextDue = new Date(Date.now() + 7 * 24 * 3600 * 1000);

      await tx.loanApplication.update({
        where: { id: app.id },
        data: { decision: 'ACCEPTED' },
      });

      await tx.loan.create({
        data: {
          bankId: app.bankId,
          applicationId: app.id,
          status: 'ACTIVE',
          principal: app.amount,
          remaining: app.amount,
          rate: app.proposedRate,
          durationSec: app.durationSec,
          nextDueAt: nextDue,
        },
      });

      await tx.bank.update({
        where: { id: app.bankId },
        data: {
          liquidity: { decrement: app.amount * 0.9 },
          reputation: { increment: 0.03 },
        },
      });

      await tx.transactionLedger.create({
        data: {
          bankId: app.bankId,
          type: 'LOAN_ORIGINATION',
          amount: app.amount,
          metadata: {
            applicationId: app.id,
            segment: app.segment,
          },
        },
      });
    }

    await tx.auditLog.create({
      data: {
        action: 'SIM_loanEngine',
        entity: 'SIM',
        entityId: 'core',
        payload: { approved, rejected, at: new Date().toISOString() },
      },
    });

    return { approved, rejected };
  });
}
