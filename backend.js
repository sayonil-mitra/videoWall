const express = require("express");
// import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
const KJUR = require("jsrsasign");
import ZoomMtg from "@zoomus/websdk";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load("en-US");
ZoomMtg.i18n.reload("en-US");

ZoomMtg.setZoomJSLib("https://source.zoom.us/3.5.2/lib", "/av");

const app = express();

app.get("/join", (request, response) => {
  //   joinMeet();
  response.end("joined");
});

// ======================== signature JWT
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBLZXkiOiJuc0NiRG5JNlNLU01PRzlYVVJibGpRIiwibW4iOjc5OTc5OTM4NjQsInJvbGUiOjAsImlhdCI6MTcxMjMxNzI2OCwiZXhwIjoxNzEyMzI0NDY4LCJ0b2tlbkV4cCI6MTcxMjMyNDQ2OH0.oVcRzk284cpAQXbPFviT2PdSHPNXEo7xq0XyikpaEVA

app.get("/signature", (request, response) => {
  let key = "nsCbDnI6SKSMOG9XURbljQ";
  let secret = "1CfhlApkHSRFMBslYuEBqnJJ1wX3Fy6H";
  let meetingNumber = 7997993864;
  let role = 0; // participant role]
  let signature = generateSignature(key, secret, meetingNumber, role);
  response.end(`signature ${signature}`);
});

app.listen(4000, () => {
  console.log("node app running");
});

// function joinMeet() {
//   ZoomMtg.init({
//     leaveUrl: "http://www.zoom.us", // https://example.com/thanks-for-joining
//     success: (success) => {
//       ZoomMtg.join({
//         sdkKey: sdkKey,
//         signature: signature, // role in SDK signature needs to be 0
//         meetingNumber: meetingNumber,
//         passWord: passWord,
//         userName: userName,
//         success: (success) => {
//           console.log(success);
//         },
//         error: (error) => {
//           console.log(error);
//         },
//       });
//     },
//     error: (error) => {
//       console.log(error);
//     },
//   });
// }

function generateSignature(key, secret, meetingNumber, role) {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    // sdkKey: key,
    appKey: key,
    mn: meetingNumber,
    role: role,
    iat: iat,
    exp: exp,
    tokenExp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, secret);
  return sdkJWT;
}
