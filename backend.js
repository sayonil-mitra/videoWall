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
  let buttonId = ".mbTuDeF1";

  try {
    // Launch headless browser
    // const browser = await puppeteer.launch({
    //   headless: false,
    //   defaultViewport: {
    //     width: 1280,
    //     height: 720,
    //   },
    // });
    // mbTuDeF1

    // Open the URL in a new page
    // const page = await browser.newPage();
    // await page.goto(url);
    const meetId = meetingId.trim();
    const meetPassCode = passcode.trim();
    const joineeName = name.trim();
    console.log(meetId, meetPassCode, joineeName);
    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--disable-notifications",
        "--enable-automation",
        "--start-maximized",
      ],
      ignoreDefaultArgs: false,
    });
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
    // await page.waitForFunction(`
    // document.querySelector("webclient").contentDocument.querySelector(".join-audio-by-voip__join-btn")
    // `);
    // const sf = await page.waitForSelector("#webclient");
    // const sframe = await sf.contentFrame();
    // await sframe.click(".join-audio-by-voip__join-btn");
    setTimeout(async () => {
      await frame.$$eval("span", (els) => {
        els.find((el) => el.textContent.trim() == "Share Screen").click();
        // console.log(els);
      });
    }, [5000]);
    await frame.mouse.click(200, 200);
    // await frame.waitForSelector(".sharing-entry-button-container--green");
    // await frame.click(".sharing-entry-button-container--green");
    // await page.screenshot({path: "zoom.png"});
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
