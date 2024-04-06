import express from "express";
import puppeteer from "puppeteer";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to launch headless browser and open the URL
app.post("/join", async (req, res) => {
  // Extract URL from the request body
  const { url } = req.body;
  let buttonId = ".mbTuDeF1";

  try {
    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 1280,
        height: 720,
      },
    });
    // mbTuDeF1

    // Open the URL in a new page
    const page = await browser.newPage();
    await page.goto(url);

    // Inject Zoom Web SDK scripts into the page
    await page.evaluate(() => {
      const scripts = [
        "https://source.zoom.us/1.9.0/lib/vendor/react.min.js",
        "https://source.zoom.us/1.9.0/lib/vendor/react-dom.min.js",
        "https://source.zoom.us/1.9.0/lib/vendor/redux.min.js",
        "https://source.zoom.us/1.9.0/lib/vendor/redux-thunk.min.js",
        "https://source.zoom.us/1.9.0/lib/vendor/lodash.min.js",
        "https://source.zoom.us/1.9.0/lib/vendor/moment.min.js",
        "https://source.zoom.us/1.9.0/lib/index.min.js",
      ];

      scripts.forEach((src) => {
        const script = document.createElement("script");
        script.src = src;
        document.head.appendChild(script);
      });
    });

    // Execute Zoom SDK code within the browser context
    await page.evaluate(() => {
      // Here you can write your Zoom SDK code
      // For example, initializing Zoom and joining a meeting
      ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.0/lib", "/av");
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareJssdk();

      try {
        ZoomMtg.init({
          leaveUrl: "https://zoom.us/",
          isSupportAV: true,
          success: function () {
            ZoomMtg.join({
              signature: "your-signature",
              apiKey: "your-api-key",
              meetingNumber: "your-meeting-number",
              userName: "Your Name",
              userEmail: "your-email@example.com",
              passWord: "your-meeting-password",
              success: function (res) {
                console.log("join meeting success");
              },
              error: function (res) {
                console.error("join meeting failed", res);
              },
            });
          },
          error: function (res) {
            console.error("ZoomMtg.init failed", res);
          },
        });
      } catch (error) {}
    });

    // Send a success response
    res.json({
      message: "Headless browser launched and URL opened successfully",
    });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while launching headless browser" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
