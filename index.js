document.addEventListener("DOMContentLoaded", function () {
  let meetingNumber = "72092023204";
  let appKey = "nsCbDnI6SKSMOG9XURbljQ";
  let sdkSecret = "1CfhlApkHSRFMBslYuEBqnJJ1wX3Fy6H";
  let passCode = "e1x9gn";
  let role = "0";

  ZoomMtg.preLoadWasm();
  ZoomMtg.prepareWebSDK();

  // loads language files, also passes any error messages to the ui
  ZoomMtg.i18n.load("en-US");

  function generateSignature(key, secret, meetingNumber, role) {
    const iat = new Date().getTime() / 1000 - 30;
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: "HS256", typ: "JWT" };

    const oPayload = {
      sdkKey: key,
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

  let jwtToken = generateSignature(appKey, sdkSecret, meetingNumber, role);

  jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJuc0NiRG5JNlNLU01PRzlYVVJibGpRIiwiYXBwS2V5IjoibnNDYkRuSTZTS1NNT0c5WFVSYmxqUSIsIm1uIjoiNzIwOTIwMjMyMDQiLCJyb2xlIjowLCJpYXQiOjE3MTMxNjUxMDIsImV4cCI6MTcxMzE3MjMwMiwidG9rZW5FeHAiOjE3MTMxNzIzMDJ9.IGC2-ZCbfQX9mrkxfYFqssGMFRL0beLX3tnnaMg5EsA";
  console.log(jwtToken);
  console.log(typeof SharedArrayBuffer === "function");

  // init zoom client and join meet
  ZoomMtg.init({
    leaveUrl: "https://www.zoom.us",
    isSupportAV: true,
    success: function (res) {
      console.log("zoom init success", res);
    },
    error: function (res) {
      console.log("zoom init fail", res);
    },
  });

  ZoomMtg.join({
    meetingNumber: meetingNumber,
    sdkKey: appKey,
    appKey: appKey,
    userName: "sayo",
    passWord: passCode,
    appKey: appKey,
    signature: jwtToken,
    success: function (res) {
      console.log("join meeting success");
    },
    error: function (res) {
      console.log(res);
    },
  });
});
