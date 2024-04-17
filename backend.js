import express from "express";
import puppeteer, { Dialog, Keyboard,  Mouse } from "puppeteer";
import { screen, mouse, straightTo, centerOf, keyboard, Key } from "@nut-tree/nut-js";
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import { spawn } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";


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
        // "--use-fake-ui-for-media-stream", // Use fake media stream dialogs
        "--use-fake-device-for-media-stream", // Use fake device for media stream
        '--auto-select-desktop-capture-source="Entire screen"', // Automatically select the entire screen in screen sharing
      ],
      ignoreDefaultArgs: false,
        defaultViewport: {
          width: 1280,
          height: 720,
        },
    });
    const [page] = await browser.pages();
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
    await page.setUserAgent(ua);
    await page.goto(url);
    await page.goto("https://app.zoom.us/wc/join");
    const p2 = await browser.newPage();
    await p2.goto(url);
    await keyboard.pressKey(Key.LeftControl, Key.Tab);
    await keyboard.releaseKey(Key.LeftControl);
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
    setTimeout(async () => {
      await frame.$$eval("span", (els) => {
        els.find((el) => el.textContent.trim() == "Share Screen").click();
      });
      setTimeout(async()=>{
        await keyboard.pressKey(Key.Tab);
        await keyboard.pressKey(Key.Left);
        await keyboard.pressKey(Key.Left);
        await keyboard.pressKey(Key.Tab);
        await keyboard.pressKey(Key.Down);
        await keyboard.pressKey(Key.Return);
        setTimeout((async()=>{
          await keyboard.pressKey(Key.LeftControl, Key.M);
          await keyboard.releaseKey(Key.LeftControl);
        }), [1000])
      }, [2000])
    }, [5000]);
    res.json({
      message: "Headless browser launched and URL opened successfully"
    });
  } catch (error) {
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
