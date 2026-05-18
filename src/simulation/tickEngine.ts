import Redis from 'ioredis';
import { prisma } from '@/lib/prisma';
import { runBranchEngine } from './branchEngine';
import { runClientGrowthEngine } from './clientGrowthEngine';
import { runDepositEngine } from './depositEngine';
import { runLoanEngine } from './loanEngine';
import { runNotificationEngine } from './notificationEngine';
import { runRegulatoryEngine } from './regulatoryEngine';
import { runSnapshotEngine } from './snapshotEngine';

const redis = new Redis(process.env.REDIS_URL!);

export async function runTick() {
  const lock = await redis.set('sim:lock', '1', 'EX', 10, 'NX');
  if (!lock) return false;

  try {
    const tick = await prisma.simulationTick.create({ data: { tickAt: new Date(), processed: false } });

    await runBranchEngine(prisma);
    await runClientGrowthEngine(prisma);
    await runDepositEngine(prisma);
    await runLoanEngine(prisma);
    await runRegulatoryEngine(prisma);
    await runNotificationEngine(prisma);
    await runSnapshotEngine(prisma);

    await prisma.simulationTick.update({
      where: { id: tick.id },
      data: { processed: true },
    });

    return true;
  } finally {
    await redis.del('sim:lock');
  }
}
