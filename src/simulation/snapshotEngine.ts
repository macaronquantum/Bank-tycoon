import { PrismaClient } from '@prisma/client';
export async function runSnapshotEngine(prisma: PrismaClient){
  return prisma.$transaction(async(tx)=>tx.auditLog.create({data:{action:'SIM_snapshotEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
