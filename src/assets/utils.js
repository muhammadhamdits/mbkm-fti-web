const formatDate = (date) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const d = new Date(date)
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const countMonthsDays = (dateStart, dateEnd) => {
  const d1 = new Date(dateStart)
  const d2 = new Date(dateEnd)
  const diff = d2.getTime() - d1.getTime()
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24))
  const diffMonths = Math.floor(diffDays / 30)
  const diffDaysLeft = diffDays % 30
  return `${diffMonths} bulan ${diffDaysLeft} hari`
}

const countDays = (dateStart, dateEnd = new Date()) => {
  const d1 = new Date(dateStart)
  const d2 = new Date(dateEnd)
  const diff = d2.getTime() - d1.getTime()
  const diffDays = Math.floor(diff / (1000 * 3600 * 24))
  return `${diffDays} hari`
}

const isInRange = (date, dateStart, dateEnd) => {
  const d = new Date(date).setHours(0, 0, 0, 1)
  const d1 = new Date(dateStart).setHours(0, 0, 0, 0)
  const d2 = new Date(dateEnd).setHours(0, 0, 0, 2)
  return d >= d1 && d <= d2
}

const isLater = (date) => {
  const d = new Date(date).setHours(0, 0, 0, 0)
  const d1 = new Date()
  return d > d1
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const delay = ms => new Promise(res => setTimeout(res, ms))

export { formatDate, countMonthsDays, capitalize, countDays, isInRange, isLater, delay }