import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const ISRAEL_TZ = 'Asia/Jerusalem'

export const israelNow = () => dayjs().tz(ISRAEL_TZ)

export const getIsraelTime = () => israelNow().format('HH:mm')

export default dayjs
