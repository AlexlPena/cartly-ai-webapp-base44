import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Use service role since this runs as a scheduled task
    const allItems = await base44.asServiceRole.entities.ListItem.filter({});
    const allUsers = await base44.asServiceRole.entities.User.list();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let created = 0;

    for (const item of allItems) {
      if (!item.expiration_date) continue;

      const expDate = new Date(item.expiration_date);
      expDate.setHours(0, 0, 0, 0);

      const daysUntilExpiry = Math.round((expDate - today) / (1000 * 60 * 60 * 24));

      // Only notify for items expiring in 7, 3, or 1 days (or already expired)
      const shouldNotify = [7, 3, 1, 0].includes(daysUntilExpiry);
      if (!shouldNotify) continue;

      const userEmail = item.created_by;
      if (!userEmail) continue;

      // Avoid duplicate notifications for the same item+day
      const existingToday = await base44.asServiceRole.entities.Notification.filter({
        item_id: item.id,
        user_email: userEmail,
      });

      const alreadySentToday = existingToday.some((n) => {
        const nDate = new Date(n.created_date);
        nDate.setHours(0, 0, 0, 0);
        return nDate.getTime() === today.getTime();
      });

      if (alreadySentToday) continue;

      let title, message, type;

      if (daysUntilExpiry === 0) {
        title = `⚠️ ${item.name} expires today!`;
        message = `"${item.name}" in your list expires today. Use it before it's too late!`;
        type = "expiration_critical";
      } else if (daysUntilExpiry === 1) {
        title = `⚠️ ${item.name} expires tomorrow`;
        message = `"${item.name}" expires tomorrow. Make sure to use it soon!`;
        type = "expiration_critical";
      } else {
        title = `🕐 ${item.name} expires in ${daysUntilExpiry} days`;
        message = `"${item.name}" will expire in ${daysUntilExpiry} days.`;
        type = "expiration_warning";
      }

      await base44.asServiceRole.entities.Notification.create({
        user_email: userEmail,
        title,
        message,
        type,
        is_read: false,
        list_id: item.list_id,
        item_id: item.id,
      });

      created++;
    }

    return Response.json({ success: true, notifications_created: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});