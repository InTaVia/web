/* eslint-disable no-console */

export const log = {
  log(...messages: Array<unknown>): void {
    console.log(...messages);
  },
  info(...messages: Array<unknown>): void {
    console.info('➡️ ', ...messages);
  },
  success(...messages: Array<unknown>): void {
    console.info('✅ ', ...messages);
  },
  warn(...messages: Array<unknown>): void {
    console.warn('⚠️ ', ...messages);
  },
  error(...messages: Array<unknown>): void {
    console.error('❌ ', ...messages);
  },
};
