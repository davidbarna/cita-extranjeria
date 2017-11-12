const task = require('./task');
const TIMEOUT = 60 * 1000 // 1 minute
const info = {
  provinceValue: 'Barcelona',
  requestValue: 'SOLICITUD DE AUTORIZACIONES',
  person: {
    name: 'EVAN WILLIAM GRAHAM',
    email: 'davidbarna@gmail.com',
    yearOfBirth: '1982',
    documentNumber: '524289319'
  }
}

const execute = () => task(info)
  .then(() => {
    console.log(`Next attempt in ${TIMEOUT}ms`)
    setTimeout(execute, TIMEOUT)
  })
  .catch((err) => {
    console.log('Error: ' + err.message)
    console.log(`Retry in 5 seconds`)
    setTimeout(execute, 5000)
  })

execute()
