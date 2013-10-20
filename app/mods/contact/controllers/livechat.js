
var db = require('../../../lib/db');


exports.livechat = {
    'path': '/contact/livechat'
  , 'fn': function(req, res, next) {
      var uid = req.session['livechatUID'] = req.session['livechatUID'] || Math.floor(Math.random() * 100000)
        , user = req.isAuthenticated() ? req.user.login : uid
        , livechatID = req.session['livechatID'] || null;

      if (livechatID) return res.redirect('/contact/livechat/' + livechatID);

      db.Livechat.find(function(err, livechats) {
        if (err) {
          console.log(err);
          return;
        }

        livechats.forEach(function( livechat ) {
          livechat.users.forEach(function(u) {
            if ((u.login == user) || (u.login == uid)) {
              livechatID = req.session['livechatID'] = livechat._id;
              return res.redirect('/contact/livechat/' + livechatID);
            }
          });
        });
      });

      /* here we decide if we want private or pubilc chats */
      var privateChats = false
        , newLivechat = function() {
            new db.Livechat({}).save(function(err, livechat) {
              if (err) {
                console.log(err);
                return;
              }

              livechatID = req.session['livechatID'] = livechat._id;
              return res.redirect('/contact/livechat/' + livechatID);
            });
          };
      
      if (privateChats) newLivechat();
      else {

        db.Livechat.find(function(err, livechats) {
          if (err || !livechats) {
            console.log(err);
            return;
          }

          if (!livechats.length) return newLivechat();

          livechatID = req.session['livechatID'] = livechats[0]._id;
          return res.redirect('/contact/livechat/' + livechatID);
        });

      }
    }
};

exports.livechatWithID = {
    'path': '/contact/livechat/:livechatID'
  , 'fn': function(req, res, next) {
      res.render('livechat', {'ngApp': 'ng-contact'});
    }
};

