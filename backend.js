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

    // Wait for the button with class "muF1" to render
    // setTimeout(() => {
    //   page.waitForSelector(buttonId);
    //   // Click on the button
    //   page.click(buttonId);
    // }, 10000);
    // await page.waitForSelector(buttonId);

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
