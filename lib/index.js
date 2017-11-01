const task = require('./task');
const TIMEOUT = 5 * 60 * 1000
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
  .catch((err) => {
    console.log(err.message)
  })
  .then(() => {
    console.log(`Next attempt in ${TIMEOUT}ms`)
    setTimeout(execute, TIMEOUT)
  })

execute()
