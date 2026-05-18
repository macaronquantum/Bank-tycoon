import { PrismaClient } from '@prisma/client';
export async function runStaffEngine(prisma: PrismaClient){
  return prisma.(async(tx)=>tx.auditLog.create({data:{action:'SIM_staffEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
