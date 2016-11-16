var nodemailer = require("nodemailer")
    , _ = require("underscore")
    , logger = require("../libs/log")(module)
    , config = require("../config");

function EmailSender(data){
    this.data = data;
    this.init();
}
_.extend(EmailSender.prototype, {

    init: function(){
        this.smtpTransport = nodemailer.createTransport("SMTP",{
            service: config.get("email:service"),
            auth: {
                user: config.get("email:auth:user"),
                pass: config.get("email:auth:pass")
            }
        });

        this.mailOptions = {
            from: this.data.from || config.get("email:default:from"), // sender address
            to: this.data.to || config.get("email:list").join(','), // list of receivers
            subject: this.data.subject || config.get("email:default:subject") // Subject line
        }

        if( this.data.text ){
            this.mailOptions.text = this.data.text;
        }else if( this.data.body ){
            this.mailOptions.body = this.data.body;
        }else if( this.data.html ){
            this.mailOptions.html = this.data.html;
        }else{
            this.mailOptions.text = "no text or body...";
        }

    },

    send: function(){
        var _this = this;

        this.smtpTransport.sendMail(this.mailOptions, function(err, response){
            if(err){
                logger.log('error', err);
                throw new Error(err);
            }else{
                logger.log('info', "Message sent: " + response.message);
            }

            // if you don't want to use this transport object anymore, uncomment following line
            _this.smtpTransport.close();
        });
    }
})

module.exports = EmailSender;
