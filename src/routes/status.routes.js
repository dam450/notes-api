const { Router } = require('express')

const statusRouter = Router()

statusRouter.get('/', (req, res) => {
  console.time('[Status] ')

  const dateObject = new Date()
  const minutesOnline = ((dateObject - globalThis.onlineSince)/1000/60).toFixed(0)
  const day = (`0${dateObject.getDate()}`).slice(-2)
  const month = (`0${dateObject.getMonth() + 1}`).slice(-2)
  const year = dateObject.getFullYear()
  const hours = dateObject.getHours()
  const minutes = (`0${dateObject.getMinutes()}`).slice(-2)
  const seconds = (`0${dateObject.getSeconds()}`).slice(-2)
  const dateTime = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`
 
  res.send(`
    Server is ${minutesOnline} minutes Online! 🚀 <br /> 
    [ ${dateTime} ] <br /> 
  `)

  console.timeEnd('[Status] ')
})

module.exports = statusRouter