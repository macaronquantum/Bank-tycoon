import { PrismaClient } from '@prisma/client';
export async function runCrisisEngine(prisma: PrismaClient){
  return prisma.$transaction(async(tx)=>tx.auditLog.create({data:{action:'SIM_crisisEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
