const puppeteer = require('puppeteer');
const config = require('./config');
const {
  selectOptionByLabel,
  hackReCaptcha,
  sendMailReport
} = require('./helpers');
const {selectors: sel, messages: msg} = config;
const {log} = console;
const REPORT_INTERVAL = 60 // Send report every {REPORT_INTERVAL} failures
let failureReports = []

let uniqueBrowserInstance
const getBrowser = async (config) => {
  if(!uniqueBrowserInstance) {
    uniqueBrowserInstance = puppeteer.launch(config.puppeteer)
  }
  return uniqueBrowserInstance
}

const executeTask = async ({provinceValue, requestValue, person}) => {
  const browser = await getBrowser(config)
  const page = await browser.newPage();
  await page.goto(config.url);

  log('Choose province and click "accept"')
  await selectOptionByLabel(page, sel.PROVINCE, provinceValue)
  await page.click(sel.ACCEPT)

  log('Choose request type and click "accept"')
  await selectOptionByLabel(page, sel.REQUEST, requestValue)
  await page.click(sel.ACCEPT)

  log('Click "enter"')
  await page.waitForSelector(sel.CONFIRM_REQUEST)
  await page.click(sel.CONFIRM_REQUEST)

  log('Fill in person\'s info and click "accept"')
  await page.waitForSelector(sel.DOCUMENT)

  await page.waitFor(500)
  await page.click(sel.DOCUMENT)
  await page.focus(sel.DOCUMENT_NUMBER)
  await page.keyboard.type(person.documentNumber)
  await page.focus(sel.NAME)
  await page.keyboard.type(person.name)
  await page.focus(sel.BIRTH)
  await page.keyboard.type(person.yearOfBirth)
  await hackReCaptcha(page)
  await page.click(sel.ACCEPT)
  await page.waitForSelector(sel.REQUEST_APPOINTMENT)


  log('Request an appointment')
  await hackReCaptcha(page)
  await page.click(sel.REQUEST_APPOINTMENT)

  let noAppointments
  try {
    await page.waitForSelector(sel.MESSAGE_TABLE, {timeout: 5000})
    const content = await page.content()
    if (!content.includes(msg.NO_APPOINTMENTS_MSG)) {
      throw new Error(`Missing message "${msg.NO_APPOINTMENTS_MSG}"`)
    } else {
      noAppointments = true
    }
  } catch (err) {
    noAppointments = false
  }

  if(noAppointments) {
    log( 'FAILURE: No appointments available')
    failureReports.push(new Date().toString())
    if(!(failureReports.length%REPORT_INTERVAL)) {
      await sendMailReport(page, person.email, 'FAILURE: No appointments available', failureReports.join('<br />') )
      failureReports = []
    }
  } else {
    log(`Missing message "${msg.NO_APPOINTMENTS_MSG}"`)
    log( 'SUCCESS: Appointments available')
    await sendMailReport(page, person.email, 'SUCCESS: Appointments available')
  }

  await page.close()
}

module.exports = executeTask
