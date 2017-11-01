const nodemailer = require('nodemailer')
const fs = require('fs')
const smtpTransport = nodemailer.createTransport({
 service: 'gmail',
 auth: {
    user: "nodemailer.davidbarna@gmail.com",
    pass: "nodemailer1982"
  }
})

const sendMailReport = async (page, to, subject) => {
  const screenshotPath = `./.screenshots/${new Date().toString()}.png`
  const content = await page.content()
  const mailOptions = {
     from: to, to, subject,
     html: '<p>Your html here</p>',
     attachments: [
      { filename: 'screenshot.png', path: screenshotPath },
      { filename: 'page.html', content }
    ]
  }
  await page.screenshot({path: screenshotPath})
  await new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, function(error, response){
      error ? reject(error) : resolve(true)
    })
  })

  return new Promise((resolve, reject) => {
    fs.unlink(screenshotPath, (err) => {
      err ? reject(err) : resolve()
    })
  })
}

const selectOptionByLabel = async (page, selector, value) => {
  await page.waitForSelector(selector)
  return page.evaluate((selector, value) => {
    let select = document.querySelectorAll(selector)[0]
    let options = select.options
    let filteredOptions = Array
      .from(options)
      .filter(option => option.innerText.includes(value))
    select.selectedIndex = filteredOptions[0].index
  }, selector, value)
}

const hackReCaptcha = async page => page.evaluate(() => {
  window.validaCapturador = () => true
})

module.exports = {
  selectOptionByLabel,
  hackReCaptcha,
  sendMailReport
}
