const router = require('express').Router();

const {
    sendMailer
} = require('../controller/appController.js');

const { getAuthSheets } = require('../controller/sheet.js');

/** HTTP Reqeust */
router.post('/product/sendMailer', sendMailer);
router.post("/sheet/update", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const { dia, nome, cpf, telefone, email, resultado } = req.body;

    const pontuacao = {
        R: 0,
        I: 0,
        A: 0,
        S: 0,
        E: 0,
        C: 0
    };

    if (nome == null) return res.status(400).json({ msg: "Informe o nome" })
    if (cpf == null) return res.status(400).json({ msg: "Informe o cpf" })
    if (telefone == null) return res.status(400).json({ msg: "Informe o telefone" })
    if (email == null) return res.status(400).json({ msg: "Informe o email" })
    if(resultado == null)return res.status(400).json({ msg: "Resultado nao identificado" })
    resultado.forEach((ponto) => {
        pontuacao[ponto.categoria] = ponto.valor.toFixed(2)
    });
    const resultadoString = JSON.stringify(pontuacao);

    try {
        const row = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Página1",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[dia, nome, cpf, telefone, email, resultadoString]]
            }
        });
        
        res.status(200).json({ msg: row.data });
    } catch (error) {

        res.status(500).json({ msg: "erro ao salvar"})
    }


    
})

router.get("/teste", (req, res) => res.status(200).json({ msg: "conexao estabelecida" }))
module.exports = router