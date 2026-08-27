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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Valida tu email</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: 'Segoe UI', Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 32px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                        <tr>
                            <td style="background:linear-gradient(135deg, #6d28d9, #4c1d95); padding:32px; text-align:center;">
                                <h1 style="margin:0; color:#ffffff; font-size:24px;">Udemix</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:32px;">
                                <h2 style="margin-top:0; color:#1f2937; font-size:20px;">¡Ya casi estas listo para crear cursos!</h2>
                                <p style="color:#4b5563; font-size:15px; line-height:1.6;">
                                    Recibimos una solicitud para validar el email <strong>${ email }</strong> asociado a tu cuenta de Udemix.
                                    Para desbloquear la creación de cursos, necesitamos confirmar que esta direccion te pertenece.
                                </p>
                                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
                                    <tr>
                                        <td align="center" style="border-radius:6px; background-color:#6d28d9;">
                                            <a href="${ link }" target="_blank" style="display:inline-block; padding:14px 32px; color:#ffffff; text-decoration:none; font-weight:bold; font-size:15px; border-radius:6px;">
                                                Validar mi email
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="color:#6b7280; font-size:13px; line-height:1.6;">
                                    Si el boton no funciona, copia y pega este link en tu navegador:
                                </p>
                                <p style="word-break:break-all; font-size:13px;">
                                    <a href="${ link }" style="color:#6d28d9;">${ link }</a>
                                </p>
                                <p style="color:#9ca3af; font-size:12px; margin-top:24px;">
                                    Si no solicitaste esta validacion, podes ignorar este correo con tranquilidad.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#f9fafb; padding:20px 32px; text-align:center; border-top:1px solid #e5e7eb;">
                                <p style="margin:0; color:#9ca3af; font-size:12px;">
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
