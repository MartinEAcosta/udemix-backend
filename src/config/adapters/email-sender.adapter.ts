import nodemailer, { Transporter } from 'nodemailer';

import { MailerService, SendEmailOptions } from "../../domain/services/MailerService";

export class EmailSenderAdapter implements MailerService {

    private transporter : Transporter;
    public baseURL      : string;

    constructor( 
        mailerService       :  string,
        mailerEmail         :  string,
        senderEmailPassword : string,
        baseURL             : string,
    ) { 
        this.transporter = nodemailer.createTransport({
            service : mailerService,
            auth    : {
                user : mailerEmail,
                pass : senderEmailPassword
            },
        });
        this.baseURL = baseURL;
    }

    async sendEmail( options : SendEmailOptions ) : Promise<boolean> {

        const { to , subject , htmlBody } = options;

        try{
            const info = await this.transporter.sendMail(
                                                        {
                                                            to,
                                                            subject,
                                                            html : htmlBody,
                                                        }
                                                    );

            return true;
        }
        catch( error ){
            console.log(error);
            return false;
        }
    }
    
}