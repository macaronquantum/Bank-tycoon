import { PrismaClient } from '@prisma/client';
export async function runMarketEngine(prisma: PrismaClient){
  return prisma.$transaction(async(tx)=>tx.auditLog.create({data:{action:'SIM_marketEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
