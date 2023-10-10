const express = require('express');

const { google } = require('googleapis')

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(filePath, 'utf8'));


async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({

        keyFile: filePath,
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });




    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: "v4",
        auth: client,

    });

    const spreadsheetId = "16XW02uXluw3_SIJphrdmN2UX4kJ9cVdcGZPcmlmg-yY";
    return { auth, client, googleSheets, spreadsheetId }
}

module.exports = {
    getAuthSheets
}