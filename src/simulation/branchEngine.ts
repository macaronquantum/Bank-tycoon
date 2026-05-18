import { PrismaClient } from '@prisma/client';
export async function runBranchEngine(prisma: PrismaClient){
  return prisma.$transaction(async(tx)=>tx.auditLog.create({data:{action:'SIM_branchEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
