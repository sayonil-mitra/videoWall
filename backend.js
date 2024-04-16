import express from "express";
import puppeteer, { Dialog, Keyboard, Mouse } from "puppeteer";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
let browser;
// Route to launch headless browser and open the URL
app.post("/capture", async (req, res) => {
  // Extract URL from the request body
  const { url } = req.body;

  // Make sure URL is provided
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Launch Puppeteer browser
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url);

    // Capture a screenshot as a buffer
    const screenshotBuffer = await page.screenshot({ type: "png" });

    // Define file paths
    const pngFilePath = path.join(__dirname, "screenshot.png");
    const yuvFilePath = path.join(__dirname, "output.yuv");

    // Write the screenshot buffer to a file
    fs.writeFileSync(pngFilePath, screenshotBuffer);

    // Use FFmpeg to convert the PNG file to a YUV file
    const ffmpegProcess = spawn("ffmpeg", [
      "-i",
      pngFilePath,
      "-pix_fmt",
      "yuv420p",
      yuvFilePath,
    ]);

    // Handle FFmpeg process exit
    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        // Conversion was successful
        res.json({ message: "Conversion successful", yuvFilePath });
      } else {
        // Conversion failed
        res.status(500).json({ error: "Conversion failed" });
      }

      // Clean up the PNG file
      fs.unlinkSync(pngFilePath);
    });

    // Handle errors from FFmpeg
    ffmpegProcess.on("error", (err) => {
      res.status(500).json({ error: "FFmpeg error: " + err.message });
    });

    // Close the browser
    await browser.close();
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: err.message });

    // Ensure the browser is closed if an error occurs
    if (browser) {
      await browser.close();
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
