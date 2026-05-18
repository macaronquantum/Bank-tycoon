import { PrismaClient } from '@prisma/client';
export async function runClientGrowthEngine(prisma: PrismaClient){
  return prisma.$transaction(async(tx)=>tx.auditLog.create({data:{action:'SIM_clientGrowthEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
