import { PrismaClient } from '@prisma/client';
export async function runLoanEngine(prisma: PrismaClient){
  return prisma.(async(tx)=>tx.auditLog.create({data:{action:'SIM_loanEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
