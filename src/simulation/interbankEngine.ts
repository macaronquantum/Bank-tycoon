import { PrismaClient } from '@prisma/client';
export async function runInterbankEngine(prisma: PrismaClient){
  return prisma.$transaction(async(tx)=>tx.auditLog.create({data:{action:'SIM_interbankEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
