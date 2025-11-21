// Client-side activity logger devre dışı bırakıldı
// Artık server-side activity logging kullanıyoruz

export class ActivityLogger {
  private static instance: ActivityLogger;

  static getInstance(): ActivityLogger {
    if (!ActivityLogger.instance) {
      ActivityLogger.instance = new ActivityLogger();
    }
    return ActivityLogger.instance;
  }

  async log(activityData: any) {
    // Client-side logging devre dışı
    console.log('Client-side activity logging disabled - using server-side logging');
    return;
  }
}

// Kolay kullanım için export
export const activityLogger = ActivityLogger.getInstance();
