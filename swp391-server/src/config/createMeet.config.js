const { google } = require('googleapis');
const { getOAuth2Client } = require('./googleAuth.config');
const db = require('./db.config')

async function createMeetEvent(consultant_id, date, time) {
    const [rows] = await db.execute('SELECT google_token FROM Users WHERE user_id = ? AND is_active = 1',
        [consultant_id]);
    if (!rows[0] || !rows[0].google_token) throw new Error("Consultant doesn't connect Google Calendar")
    const tokens = JSON.parse(rows[0].google_token);

    const oAuth2Client = getOAuth2Client();
    oAuth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const event = {
        summary: "Consultation appointment",
        start: { dateTime: `${date}T${time}:00+07:00` },
        end: { dateTime: `${date}T${parseInt(time.split(':')[0]) + 1}:00:00+07:00` },
        conferenceData: {
            createRequest: { requestId: Math.random().toString(36).substring(2, 15) }
        }
    };
    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
    })
    return response.data.hangoutLink;
}

module.exports = { createMeetEvent };