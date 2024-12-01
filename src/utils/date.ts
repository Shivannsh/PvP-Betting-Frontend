import { format, formatDistanceToNow } from 'date-fns'

export const formatDateTime = (date: string | number | Date): string => {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}

export const formatTimeAgo = (date: string | number | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes
    ? `${hours}h ${remainingMinutes}m`
    : `${hours} hours`
}