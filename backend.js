import express from "express";
import puppeteer, { Dialog, Keyboard, Mouse } from "puppeteer";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
let browser;
// Route to launch headless browser and open the URL
app.post("/join", async (req, res) => {
  // Extract URL from the request body
  const { url, meetingId, passcode, name } = req.body;

  try {
    const meetId = meetingId.trim();
    const meetPassCode = passcode.trim();
    const joineeName = name.trim();
    console.log(meetId, meetPassCode, joineeName);

    // launch browser =======================================
    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--disable-notifications",
        "--enable-automation",
        "--start-maximized",
        // "--use-fake-ui-for-media-stream", // Use fake media stream dialogs
        // "--use-fake-device-for-media-stream", // Use fake device for media stream
        // '--auto-select-desktop-capture-source="Entire screen"', // Automatically select the entire screen in screen sharing
      ],
      ignoreDefaultArgs: false,
    });

    // navigate to zoom meet an join =======================================
    const [page] = await browser.pages();
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
    await page.setUserAgent(ua);
    await page.goto("https://app.zoom.us/wc/join");
    const meetingInput = await page.waitForSelector('input[type="text"]');
    await meetingInput.type(meetId);
    const joinBtn = await page.waitForSelector(".btn-join");
    await joinBtn.click();
    await page.waitForFunction(`
      document.querySelector("#webclient")
        .contentDocument.querySelector("#input-for-pwd")
    `);
    const f = await page.waitForSelector("#webclient");
    const frame = await f.contentFrame();
    await frame.type("#input-for-pwd", meetPassCode);
    await frame.type("#input-for-name", joineeName);
    await frame.$$eval("button", (els) =>
      els.find((el) => el.textContent.trim() === "Join").click()
    );
    await frame.waitForSelector(".join-dialog");

    // after joining zoom meet, close auio join ialog box an share screen =======================================
    await frame.$$eval("button", (els) => {
      els.find((el) => el?.classList.contains("join-dialog__close")).click();
    });
    setTimeout(async () => {
      await frame.$$eval("span", (els) => {
        els.find((el) => el.textContent.trim() == "Share Screen").click();
      });

      //   frame.on("dialog", (res) => console.log(res)); // check if dialog box appears
    }, [5000]);

    // success response message =======================================
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
