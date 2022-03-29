export default class MailUtil {
  static async send(from: string, html: string) {
    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email(from);
    var toEmail = new helper.Email(process.env.CONTACT_EMAIL);
    var content = new helper.Content('text/html', html);
    var mail = new helper.Mail(fromEmail, 'Bericht van pingping.amsterdam.nl', toEmail, content);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    sg.API(request, function (error: any, response: any) {
      if (error) {
        console.warn('Error response received');
      }
      console.info(response.statusCode);
      console.info(response.body);
      console.info(response.headers);

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
    });

    var helper = require('sendgrid').mail;
  }
}
