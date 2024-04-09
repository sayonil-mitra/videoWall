document.addEventListener("DOMContentLoaded", function () {
  let meetingNumber = "72092023204";
  let appKey = "nsCbDnI6SKSMOG9XURbljQ";
  let sdkSecret = "1CfhlApkHSRFMBslYuEBqnJJ1wX3Fy6H";
  let passCode = "e1x9gn";

  // ZoomMtg.preLoadWasm()
  // ZoomMtg.prepareWebSDK()

  // loads language files, also passes any error messages to the ui
  // ZoomMtg.i18n.load('en-US')

  // generate signature/ jwt token
  let jwtToken = ZoomMtg.generateSDKSignature({
    meetingNumber: meetingNumber,
    // appKey: appKey,
    sdkKey: appKey,
    sdkSecret: sdkSecret,
    role: "0",
  });

  //   jwtToken =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTI2Mzg5MDgsImV4cCI6MTcxMjY0NjEwOCwibW4iOiI5MjU1MDU2MzcwMiIsInJvbGUiOiIwIn0.dxibiKiQ5bq7rU6HtFD1F_AjRVZBbbvbK1NFXGjrBtw";
  console.log(jwtToken);

  // init zoom client and join meet
  ZoomMtg.init({
    leaveUrl: "https://www.zoom.us",
    isSupportAV: true,
    success: function (res) {
      console.log(res);
    },
    error: function (res) {
      console.log(res);
    },
  });

  ZoomMtg.join({
    meetingNumber: meetingNumber,
    sdkKey: appKey,
    // appKey: appKey,
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
