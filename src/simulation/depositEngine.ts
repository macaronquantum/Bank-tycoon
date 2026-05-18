import { PrismaClient } from '@prisma/client';
export async function runDepositEngine(prisma: PrismaClient){
  return prisma.(async(tx)=>tx.auditLog.create({data:{action:'SIM_depositEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
