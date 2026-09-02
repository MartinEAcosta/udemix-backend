interface EmailValidationTemplateOptions {
    email : string;
    link  : string;
}

export const buildEmailValidationHtml = ( { email, link } : EmailValidationTemplateOptions ) : string => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <link href="https://fonts.googleapis.com/css2?family=Playwrite+DK+Loopet:wght@100..400&display=swap" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Valida tu email</title>
    </head>
    <body style="margin:0; padding:0; background-color:rgb(233,233,233); font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgb(233,233,233); padding: 32px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                        <tr>
                            <td style="background:linear-gradient(135deg, rgb(0,120,140), rgb(0,90,105)); padding:32px; text-align:center;">
                                <h1 style="margin:0; color:#ffffff; font-size:24px; font-family:'Playwrite DK Loopet', cursive;">Udemix</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:32px;">
                                <h2 style="margin-top:0; color:rgb(40,40,40); font-size:20px;">¡Ya casi estas listo para crear cursos!</h2>
                                <p style="color:rgb(90,90,90); font-size:15px; line-height:1.6;">
                                    Recibimos una solicitud para validar el email <strong>${ email }</strong> asociado a tu cuenta de Udemix.
                                    Para desbloquear la creación de cursos, necesitamos confirmar que esta direccion te pertenece.
                                </p>
                                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
                                    <tr>
                                        <td align="center" style="border-radius:6px; background-color:rgb(0,120,140);">
                                            <a href="${ link }" target="_blank" style="display:inline-block; padding:14px 32px; color:#ffffff; text-decoration:none; font-weight:bold; font-size:15px; border-radius:6px;">
                                                Validar mi email
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="color:rgb(110,110,110); font-size:13px; line-height:1.6;">
                                    Si el boton no funciona, copia y pega este link en tu navegador:
                                </p>
                                <p style="word-break:break-all; font-size:13px;">
                                    <a href="${ link }" style="color:rgb(0,120,140);">${ link }</a>
                                </p>
                                <p style="color:rgb(150,150,150); font-size:12px; margin-top:24px;">
                                    Si no solicitaste esta validacion, podes ignorar este correo con tranquilidad.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:rgb(245,245,245); padding:20px 32px; text-align:center; border-top:1px solid rgb(220,220,220);">
                                <p style="margin:0; color:rgb(150,150,150); font-size:12px;">
                                    &copy; ${ new Date().getFullYear() } Udemix. Todos los derechos reservados.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};
