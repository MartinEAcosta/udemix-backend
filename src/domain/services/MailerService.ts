
export interface SendEmailOptions {
    to       : string,
    subject  : string,
    htmlBody : string,
}

export abstract class MailerService {

    abstract baseURL : string;

    abstract sendEmail( options : SendEmailOptions ) : Promise<boolean>;

}