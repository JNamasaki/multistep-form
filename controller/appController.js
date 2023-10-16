const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const perfis = require('../Perfis');



function pegaPerfil(item) {
    const categoriaSelecionada = item.categoria;

    const perfilSelecionado = perfis.find(perfil => perfil.categoria === categoriaSelecionada);

    return perfilSelecionado;
}

function montaEmail(resultado, nome) {

    let finalTemplate = "<body>";

    finalTemplate += `      <div class="card text-white" style="border-radius: 20px; margin:0 auto; justify-content: center; background-color: #111827;color:white;padding:5px;">
        
    <div class="card-body" style="margin:0 auto;justify-content: center; align-items: center; max-width: 500px;text-align: justify; align-self: center;color:white;">
   <h1> Olá ${nome} </h1><br>
   <p>O Resultado do seu teste é: </p></div>`;

    resultado.forEach((item) => {
        const perfil = pegaPerfil(item);

        finalTemplate += `
      
<div class="card-body" style="margin:0 auto;display: flex; flex-direction: column; justify-content: center; align-items: center; max-width: 500px;text-align: justify; align-self: center;color:white;">
        <div class="card-text" style="color:white"> 
        <h3 style="text-align: center;"> ${item.valor.toFixed(1)}%: ${perfil.perfil} </h3>
          <p>${perfil.descricao}</p>
          <h3>Profissões:</h3>
          <ul style="text-align: justify;">
            ${perfil.profissoes.map((profissao) => `<li>${profissao}</li>`).join('')}
          </ul>
        </div>
        </div>
        
      `;
    });

    finalTemplate += `   
    </div>
  `;
    finalTemplate += '</body>';

    return finalTemplate;
}

/** send mail from real gmail account */
const sendMailer = (req, res) => {

    const { destinatario_email, resultado, nome } = req.body;

    // console.log(destinatario_email)

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: process.env.MAIL_USERNAME,
            clientId: process.env.MAIL_CLIENT_ID,
            clientSecret: process.env.MAIL_CLIENT_SECRET,
            refreshToken: process.env.MAIL_OAUTH_REFRESH_TOKEN,
            accessToken: process.env.MAIL_OAUTH_ACESS_TOKEN,
        },
        
        //  Configuração pro smpt da hostinger


        //         host: "smpt.hostinger.com",
        // secure: true, 
        // secureConnection: false,
        // tls: {
        //    ciphers: "SSLv3",
        // },
        // requireTLS: true,
        // port: 465,
        // debug: true,
        // connectionTimeout: 10000,
        // auth: {
        //     user: process.env.GRIEVANCE_EMAIL,
        //     pass: process.env.GRIEVANCE_EMAIL_PASSWORD,
        // },
    });

    transporter.set("oauth2_provision_cb", (user, renew, callback) => {
        let accessToken = userTokens[user];
        if (!accessToken) {
            return callback(new Error("Unknown user"));
        } else {
            return callback(null, accessToken);
        }
    });

    let mail = montaEmail(resultado, nome);






    let message = {
        from: process.env.MAIL_USERNAME,
        to: destinatario_email, //userEmail,
        subject: "Resultado Teste de Perfil Grupo Saber",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })

    }).catch(error => {
        console.error(error);
        return res.status(500).json({ error })
    })

    // return res.send(mail)


}


module.exports = {
    sendMailer
}