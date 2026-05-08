export const APP_NAME = "Neo"
export const TAGLINE = "Your family, in sync."

export const MAPTILER_TOKEN = process.env.NEXT_PUBLIC_MAPTILER_TOKEN ?? ""

export const GPS_UPDATE_INTERVAL_MS = 30_000 // 30 seconds
export const LOCATION_HISTORY_HOURS = 24

export const MAX_PHOTO_SIZE_MB = 10
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"]

export const NOTIFICATION_BATCH_INTERVAL_MS = 300_000 // 5 minutes

export const FAMILY_ROLES = ["commander", "helper", "remote_parent", "child"] as const
