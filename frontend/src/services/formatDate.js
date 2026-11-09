export const formatDate = (dateString) => {
    if (!dateString) return null

    const options = { year: "numeric", month: "long", day: "numeric" }
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return null

    const formattedDate = date.toLocaleDateString("en-US", options)
  
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const period = hour >= 12 ? "PM" : "AM"
    const formattedTime = `${hour % 12}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`
  
    return `${formattedDate} | ${formattedTime}`
  }