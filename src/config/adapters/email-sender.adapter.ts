import nodemailer, { Transporter } from 'nodemailer';

import { EmailValidator, SendEmailOptions } from "../../domain/services/EmailValidator";

export class EmailSenderAdapter implements EmailValidator {

    private transporter : Transporter;
    public baseURL     : string;

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

            console.log( info );
            return true;
        }
        catch( error ){
            console.log(error);
            return false;
        }
    }
    
}