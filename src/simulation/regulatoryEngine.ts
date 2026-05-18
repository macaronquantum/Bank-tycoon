import { PrismaClient } from '@prisma/client';
export async function runRegulatoryEngine(prisma: PrismaClient){
  return prisma.$transaction(async(tx)=>tx.auditLog.create({data:{action:'SIM_regulatoryEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
