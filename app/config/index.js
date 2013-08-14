
var config = {
    dev: {
        port: 4000
      , mongourl: 'mongodb://localhost:4001/lazycook'

      , secret: 'Im clark kent'

      , nodemailer: 'See http://www.nodemailer.com/ for more details'
      , nodemailer: {
          transport: 'sendmail'
        , config: {
            path: '/usr/sbin/sendmail'
          }
      }
    }
};

module.exports = config[process.NODE_ENV || 'dev'] || config['dev'];