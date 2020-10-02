const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'iamravi9619@gmail.com',
        subject: 'Thanks For Joining In',
        text: `Welocme to the App. ${name}.Let me know how you get along with the App.`
    })
}

const sendCancelationEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'iamravi9619@gmail.com',
        subject: 'Sorry to see you Go',
        text: `GoodBye, ${name}.I hope to see you back sometime soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}