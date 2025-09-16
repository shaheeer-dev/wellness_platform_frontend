import { format, addDays } from 'date-fns';


export const getDefaultScheduledDate = (): string => {
  return format(addDays(new Date(), 1), 'yyyy-MM-dd');
};

export const getTodayFormatted = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const combineDateTimeToISO = (dateStr: string, timeStr: string): string => {
  return new Date(`${dateStr}T${timeStr}`).toISOString();
};
