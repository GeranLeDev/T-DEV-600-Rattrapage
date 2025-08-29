import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getRandomColor = (): string => {
  const colors = [
    '#026AA7', // Blue
    '#5AAC44', // Green
    '#F2D600', // Yellow
    '#FF9F1A', // Orange
    '#EB5A46', // Red
    '#0079BF', // Light Blue
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default {
  formatDate,
  formatDateTime,
  truncateText,
  generateId,
  debounce,
  throttle,
  getInitials,
  isValidEmail,
  getRandomColor,
};
