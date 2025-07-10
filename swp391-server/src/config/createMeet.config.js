const { google } = require('googleapis');
const db = require('./db.config')
const consultantModel = require('../app/models/consultant.model');
const memberModel = require('../app/models/member.model');

async function createMeetEvent(consultant_id, date, time, member_id) {
  const consultant = await consultantModel.findById(consultant_id);
  const member = await memberModel.findById(member_id);
  console.log(`Creating meet event for consultant: ${consultant.fullname}, member: ${member.fullname}, date: ${date}, time: ${time}, google_token: ${consultant.google_token}`);
  if (!consultant || !consultant.google_token) {
    throw new Error("Consultant hasn't connected Google Calendar");
  }

  const tokens = {
    access_token: consultant.google_token,
    refresh_token: consultant.google_refresh_token || null
  };

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2Client.setCredentials(tokens);


  // Xử lý thời gian bắt đầu và kết thúc
  const startDateTime = new Date(`${date}T${time}:00+07:00`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 giờ


  const event = {
    summary: "Consultation Appointment with " + member.fullname,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Asia/Ho_Chi_Minh',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Asia/Ho_Chi_Minh',
    },
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
  };

  const response = await google
    .calendar({ version: 'v3', auth: oAuth2Client })
    .events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

  return response.data.hangoutLink;
}

module.exports = { createMeetEvent };