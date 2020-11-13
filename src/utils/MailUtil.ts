export default class MailUtil {
  static async send(from: string, html: string) {
    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email(from);
    var toEmail = new helper.Email(process.env.CONTACT_EMAIL);
    var content = new helper.Content('text/html', html);
    var mail = new helper.Mail(fromEmail, 'Bericht van pingping.amsterdam.nl', toEmail, content);

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    sg.API(request, function (error: any, response: any) {
      if (error) {
        console.log('Error response received');
      }
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });

    var helper = require('sendgrid').mail;
  }
}
