export const humanizeDate = (dateStr) => {

  if(isNaN(Date.parse(dateStr))) {
    return "1 Jan. 2020"
  }

  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString()}`
}

export const formatDate = (dateStr) => {

  // if (Date.parse(dateStr) === NaN || dateStr === "" || dateStr ===",ko" || dateStr === "17/05/2020" || dateStr === "13/05/2020" || dateStr === "17/05/2000") return "1 Jan. 1950"

  if(isNaN(Date.parse(dateStr))) {
    return "2020-01-01"
  }
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: '2-digit' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  // const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${ye.toString()}-${mo.toString()}-${parseInt(da)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}

