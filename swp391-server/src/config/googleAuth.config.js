const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

function getOAuth2Client() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_secret, client_id, redirect_uris } = credentials.web;
    return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

}

function getAuthUrl(consultant_id) {
    const oAuth2Client = getOAuth2Client();
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
        state: consultant_id
    })
}

module.exports = { getOAuth2Client, getAuthUrl };