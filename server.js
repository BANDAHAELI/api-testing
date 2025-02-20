// Sarkar-MD
import express from "express";
import { chromium } from "playwright";

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

        // ✅ GetFvid.com - Facebook Video Downloader
        await page.goto("https://getfvid.com/");

        // ✅ Input field mein URL paste karo
        await page.fill("#url", videoURL);
        await page.click("button[type='submit']");

        // ✅ Download links wait karo
        await page.waitForSelector(".btn-download");

        // ✅ Extract HD & SD links
        const videoLinks = await page.$$eval(".btn-download", (links) =>
            links.map((link) => ({
                quality: link.innerText.trim(),
                download_url: link.href,
            }))
        );

        await browser.close();

        if (videoLinks.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No downloadable links found. The video might be private.",
            });
        }

        // ✅ API Response
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

// ✅ Server Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// POWERED BY BANDAHEALI
