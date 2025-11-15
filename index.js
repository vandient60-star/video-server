const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const app = express();

app.use(express.json());

// Test endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Merge video + audio endpoint
app.post("/merge", (req, res) => {
    const { video, audio, outputName } = req.body;
    if (!video || !audio) return res.status(400).send("video & audio required");

    const output = outputName || "output.mp4";

    ffmpeg(video)
        .input(audio)
        .outputOptions("-c:v copy")
        .save(output)
        .on("end", () => res.sendFile(`${__dirname}/${output}`))
        .on("error", (err) => res.status(500).send(err.message));
});

app.listen(3000, () => console.log("Server running on port 3000"));
