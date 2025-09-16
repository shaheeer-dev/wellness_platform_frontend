// Appointment Types - should match backend constants
export const APPOINTMENT_TYPES = [
  'Initial Consultation',
  'Follow-up',
  'Assessment', 
  'Therapy Session',
  'Group Session',
  'Check-in',
  'Emergency'
] as const;

// Business Hours Configuration
export const BUSINESS_HOURS = {
  START_TIME: '08:00',
  END_TIME: '18:00',
  SLOT_DURATION_MINUTES: 30,
  LUNCH_BREAK: {
    START: '12:00',
    END: '13:00'
  }
} as const;

// Default Form Values
export const DEFAULT_FORM_VALUES = {
  NOTES_PLACEHOLDER: 'Add any additional notes for this appointment...',
  NOTES_ROWS: 3,
  DEFAULT_TIME_SLOT: '09:00'
} as const;

// Time Slot Generation Utility
export const generateTimeSlots = (
  startTime: string = BUSINESS_HOURS.START_TIME,
  endTime: string = BUSINESS_HOURS.END_TIME,
  intervalMinutes: number = BUSINESS_HOURS.SLOT_DURATION_MINUTES,
  excludeLunchBreak: boolean = true
): string[] => {
  const slots: string[] = [];
  
  // Parse start and end times
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startDate = new Date();
  startDate.setHours(startHour, startMinute, 0, 0);
  
  const endDate = new Date();
  endDate.setHours(endHour, endMinute, 0, 0);
  
  // Lunch break times
  const lunchStart = new Date();
  const [lunchStartHour, lunchStartMinute] = BUSINESS_HOURS.LUNCH_BREAK.START.split(':').map(Number);
  lunchStart.setHours(lunchStartHour, lunchStartMinute, 0, 0);
  
  const lunchEnd = new Date();
  const [lunchEndHour, lunchEndMinute] = BUSINESS_HOURS.LUNCH_BREAK.END.split(':').map(Number);
  lunchEnd.setHours(lunchEndHour, lunchEndMinute, 0, 0);
  
  let currentTime = new Date(startDate);
  
  while (currentTime < endDate) {
    // Skip lunch break if configured
    if (excludeLunchBreak && currentTime >= lunchStart && currentTime < lunchEnd) {
      currentTime = new Date(lunchEnd);
      continue;
    }
    
    // Format time as HH:MM
    const timeString = currentTime.toTimeString().slice(0, 5);
    slots.push(timeString);
    
    // Add interval
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }
  
  return slots;
};

// Export types for TypeScript
export type AppointmentType = typeof APPOINTMENT_TYPES[number];
