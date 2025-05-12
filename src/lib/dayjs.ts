import 'dayjs/locale/pt-br'

import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import localeData from 'dayjs/plugin/localeData'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(localeData)
dayjs.locale('pt-br')

export default dayjs
