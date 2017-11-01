module.exports = {
  url: 'https://sede.administracionespublicas.gob.es/icpplus/index.html',
  selectors: {
    PROVINCE: '#provincias select',
    ACCEPT: 'table input[value="Aceptar"]',
    REQUEST: '#tramites select',
    CONFIRM_REQUEST: 'input[value="ENTRAR"]',
    DOCUMENT: 'input[value="PASAPORTE"]',
    DOCUMENT_NUMBER: '#txtNieAux',
    NAME: '#txtDesCitado',
    BIRTH: '#txtAnnoCitado',
    MESSAGE_TABLE: '.tablaBordeBajo',
    REQUEST_APPOINTMENT: 'input[value="SOLICITAR CITA"]'
  },
  messages: {
    NO_APPOINTMENTS_MSG: 'En este momento no hay citas disponibles.'
  },
  puppeteer: {
    ignoreHTTPSErrors: true,
    headless: true
  }
}
