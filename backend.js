import express from "express";
import puppeteer, { Dialog, Mouse } from "puppeteer";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
let browser;
// Route to launch headless browser and open the URL
app.post("/join", async (req, res) => {
  // Extract URL from the request body
  const { url, meetingId, passcode, name } = req.body;
  const meetId = meetingId?.trim();
  const meetPassCode = passcode?.trim();
  const joineeName = name?.trim();

  try {
    // launch browser instance
    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--disable-notifications",
        "--enable-automation",
        "--start-maximized",
      ],
      ignoreDefaultArgs: false,
    });

    // open a new page
    let page = await browser.newPage();

    // navigate to a blank page
    await page.goto("about:blank");

    // inject Zoom Web SDK and dependencies from CDN
    await page.evaluate(() => {
      const dependencies = [
        "https://source.zoom.us/{VERSION_NUMBER}/lib/vendor/react.min.js",
        "https://source.zoom.us/{VERSION_NUMBER}/lib/vendor/react-dom.min.js",
        "https://source.zoom.us/{VERSION_NUMBER}/lib/vendor/redux.min.js",
        "https://source.zoom.us/{VERSION_NUMBER}/lib/vendor/redux-thunk.min.js",
        "https://source.zoom.us/{VERSION_NUMBER}/lib/vendor/lodash.min.js",
        // Choose either client view or component view
        "https://source.zoom.us/zoom-meeting-{VERSION_NUMBER}.min.js", // for client view
        // "https://source.zoom.us/zoom-meeting-embedded-{VERSION_NUMBER}.min.js", // for component view
      ];

      dependencies.forEach((src) => {
        const script = document.createElement("script");
        script.src = src;
        document.head.appendChild(script);
      });
    });

    // success message
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
