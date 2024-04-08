import ZoomVideo from "@zoom/videosdk";

async function attachVideoStream() {
  // init client an stream
  var client = ZoomVideo.createClient();
  var stream;

  // join existing zoom session
  await client.init("en-US", "Global", { patchJsMedia: true });
  await client.join(
    "sessionName",
    "VIDEO_SDK_JWT",
    "userName",
    "sessionPasscode"
  );

  // attach video stream
  stream = client.getMediaStream();
  let userVideo = await stream.attachVideo(
    client.getCurrentUserInfo().userId,
    RESOLUTION
  );
  document.querySelector("video-player-container").appendChild(userVideo);

  // screen share
  if (stream.isStartShareScreenWithVideoElement()) {
    await stream.startShareScreen(
      document.querySelector("#my-screen-share-content-video")
    );
    // screen share successfully started and rendered
  } else {
    await stream.startShareScreen(
      document.querySelector("#my-screen-share-content-canvas")
    );
    // screen share successfully started and rendered
  }
}

module.exports = attachVideoStream;
