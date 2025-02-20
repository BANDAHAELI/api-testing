// Sarkar-MD
import express from "express";
import { chromium } from "playwright";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/fbdownload", async (req, res) => {
    const videoURL = req.query.url;
    
    if (!videoURL || !videoURL.includes("facebook.com")) {
        return res.status(400).json({
            status: false,
            message: "Invalid Facebook video URL. Please provide a valid link.",
        });
    }

    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto("https://fdown.net/"); // Facebook video downloader site

        // Input field mein URL paste karo
        await page.fill('input[name="URLz"]', videoURL);
        await page.click('button[type="submit"]');

        // Download links extract karo
        await page.waitForSelector(".btns a"); // Wait for download links
        const videoLinks = await page.$$eval(".btns a", (links) =>
            links.map((link) => ({
                quality: link.innerText.trim(),
                download_url: link.href,
            }))
        );

        await browser.close();

        // API Response
        res.json({
            status: true,
            creator: "Sarkar-Bandaheali",
            result: {
                type: "video",
                apikey: "sarkar-api",
                title: "Facebook Video Download",
                download_links: videoLinks,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch download links. Try again later.",
        });
    }
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// POWERED BY BANDAHEALI
