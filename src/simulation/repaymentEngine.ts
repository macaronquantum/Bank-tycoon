import { PrismaClient } from '@prisma/client';
export async function runRepaymentEngine(prisma: PrismaClient){
  return prisma.$transaction(async(tx)=>tx.auditLog.create({data:{action:'SIM_repaymentEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
