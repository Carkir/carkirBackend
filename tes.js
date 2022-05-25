const validator = require('email-validator')
const regex = new RegExp('^[A-Za-z][A-Za-z0-9]*$')
const str = 'diltonsa '
console.log(regex.test(str))
console.log(validator.validate('yusuf.alazhar@gmail.com'))