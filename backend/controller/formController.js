const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);

exports.contactForm = (req, res) => {
    const { name, email, message } = req.body;
    // console.log(req.body);

    const emailData = {
        to: process.env.EMAIL_TO,
        from: process.env.EMAIL_FROM,
        subject: `Contact form - Blog App`,
        text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
        html: `
            <h4>Email received from contact form:</h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://seoblog.com</p>
        `
    };

    sgMail.send(emailData).then(sent => {
        return res.json({
            success: true
        });
    }).catch(err => console.log(err))
};

// authorContactForm

exports.authorContactForm = (req, res) => {
    const { authorEmail , name, email, message } = req.body;
    // console.log(req.body);

    let mailList = [authorEmail , process.env.EMAIL_TO]

    const emailData = {
        to: mailList,
        from: process.env.EMAIL_FROM,
        subject: `Contact form - Blog App`,
        text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
        html: `
            <h4>Someone has sent mail from Blog App:</h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://seoblog.com</p>
        `
    };

    sgMail.send(emailData).then(sent => {
        return res.json({
            success: true
        });
    }).catch(err => console.log(err))
};