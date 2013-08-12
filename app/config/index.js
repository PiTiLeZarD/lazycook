
var config = {
    dev: {
        port: 4000
      , mongourl: 'mongodb://localhost:4001/lazycook'

      , smtp: 'See http://www.nodemailer.com/ for more details'
      , smtp: {
          service: "Gmail"
        , auth: {
            user: "gmail.user@gmail.com"
          , pass: "userpass"
        }
      }
    }
};

module.exports = config[process.NODE_ENV || 'dev'] || config['dev'];