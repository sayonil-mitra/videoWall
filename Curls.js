//JOIN ZOOM MEET
const JoinZoomMeetUrl = "/join";
const JoinZoomMeetPayload = {
  meetingId: "716 1252 8247",
  passcode: "ei6vM0 ",
  name: "Sayonil",
  url: "https://us04web.zoom.us/j/71612528247?pwd=zhRaWj6Vij6DziZ1HLMqjyfMu8lfMq.1",
};

// sample curl command ==============

// curl --location 'http://localhost:3000/join' \
// --header 'Content-Type: application/json' \
// --data '{
//     "url":"https://app.zoom.us/wc/92550563702/start?fromPWA=1&pwd=dFduTlh1eVNEZHFhY2ZvR0lYY1dDQT09",
//     "meetingId":"92550563702",
//     "passcode":"123456",
//     "name":"zoomBot1"
// }'
