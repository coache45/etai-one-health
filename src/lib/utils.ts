import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours()
  const firstName = name.split(' ')[0]
  if (hour < 12) return `Good morning, ${firstName}.`
  if (hour < 17) return `Good afternoon, ${firstName}.`
  return `Good evening, ${firstName}.`
}

export function getScoreColor(score: number): string {
  if (score >= 70) return '#22C55E'
  if (score >= 40) return '#F5C842'
  return '#EF4444'
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 55) return 'Fair'
  if (score >= 40) return 'Low'
  return 'Poor'
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function pluralize(count: number, word: string): string {
  return `${count} ${count === 1 ? word : word + 's'}`
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function getLastNDays(n: number): string[] {
  const dates: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

/** Clamp a number to the 0.0-1.0 unit interval (USM/CPR dimensions). */
export function clampToUnit(value: number): number {
  return Math.max(0, Math.min(1, value))
}
