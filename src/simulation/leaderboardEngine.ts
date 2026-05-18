import { PrismaClient } from '@prisma/client';
export async function runLeaderboardEngine(prisma: PrismaClient){
  return prisma.(async(tx)=>tx.auditLog.create({data:{action:'SIM_leaderboardEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
