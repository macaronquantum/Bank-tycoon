import Redis from 'ioredis';
import { prisma } from '@/lib/prisma';
import { runClientGrowthEngine } from './clientGrowthEngine';
import { runDepositEngine } from './depositEngine';
import { runLoanEngine } from './loanEngine';
const redis = new Redis(process.env.REDIS_URL!);
export async function runTick(){
 const lock = await redis.set('sim:lock','1','EX',3,'NX'); if(!lock) return false;
 try {
  await prisma.simulationTick.create({data:{tickAt:new Date()}});
  await runClientGrowthEngine(prisma as any); await runDepositEngine(prisma as any); await runLoanEngine(prisma as any);
  return true;
 } finally { await redis.del('sim:lock'); }
}
