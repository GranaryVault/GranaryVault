type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel =
  (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel)) || 'info';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function createEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    if (shouldLog('debug')) console.debug('[GranaryVault]', createEntry('debug', message, context));
  },
  info(message: string, context?: Record<string, unknown>) {
    if (shouldLog('info')) console.info('[GranaryVault]', createEntry('info', message, context));
  },
  warn(message: string, context?: Record<string, unknown>) {
    if (shouldLog('warn')) console.warn('[GranaryVault]', createEntry('warn', message, context));
  },
  error(message: string, error?: Error, context?: Record<string, unknown>) {
    if (shouldLog('error')) {
      console.error('[GranaryVault]', createEntry('error', message, {
        ...context,
        errorMessage: error?.message,
        errorStack: error?.stack,
      }));
    }
  },
};

// In production, replace with structured logging / monitoring service:
// - Sentry for error tracking
// - Datadog / New Relic for metrics
// - ELK / Loki for log aggregation
