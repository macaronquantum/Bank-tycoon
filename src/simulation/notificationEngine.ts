import { PrismaClient } from '@prisma/client';
export async function runNotificationEngine(prisma: PrismaClient){
  return prisma.$transaction(async(tx)=>tx.auditLog.create({data:{action:'SIM_notificationEngine',entity:'SIM',entityId:'core',payload:{at:new Date().toISOString()}}}));
}
