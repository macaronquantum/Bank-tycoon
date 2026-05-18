import { PrismaClient } from '@prisma/client';

export async function runNotificationEngine(prisma: PrismaClient) {
  return prisma.$transaction(async (tx) => {
    const recentChecks = await tx.regulatoryCheck.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 3 * 60 * 1000) } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    for (const check of recentChecks) {
      await tx.notification.create({
        data: {
          bankId: check.bankId,
          type: 'REGULATORY_ALERT',
          message: check.message,
          severity: check.level >= 3 ? 'HIGH' : 'MEDIUM',
        },
      });
    }

    await tx.auditLog.create({
      data: {
        action: 'SIM_notificationEngine',
        entity: 'SIM',
        entityId: 'core',
        payload: { notificationsCreated: recentChecks.length, at: new Date().toISOString() },
      },
    });

    return { notificationsCreated: recentChecks.length };
  });
}
