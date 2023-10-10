const router = require('express').Router();

const { 
    sendMailer 
 } = require('../controller/appController.js');

 const { getAuthSheets} = require('../controller/sheet.js');

/** HTTP Reqeust */
router.post('/product/sendMailer', sendMailer );
router.post("/sheet/update", async(req,res)=>{
    const { googleSheets,auth,spreadsheetId} = await getAuthSheets();

    const { values } = req.body;


    const row = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range:"Página1",
        valueInputOption:"USER_ENTERED",
        resource:{
            values:values
        }
    })

    res.status(200).json({msg: row.data});
})

router.get("/teste", (req,res)=> res.status(200).json({msg:"conexao estabelecida"}))
module.exports = router