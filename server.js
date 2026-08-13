const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "15mb" }));

const imagesFolder = path.join(__dirname, "captured-images");

if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder);
}

app.use("/captured-images", express.static(imagesFolder));

app.get("/", (req, res) => {
    
    const latestImage = path.join(imagesFolder, files[0].name);

res.sendFile(latestImage);

});

app.post("/api/upload", (req, res) => {
    try {
        const imageData = req.body.image;

        if (!imageData) {
            return res.status(400).json({
                success: false,
                message: "لم يتم إرسال صورة"
            });
        }

        const base64Data = imageData.replace(
            /^data:image\/png;base64,/,
            ""
        );

        const fileName = `capture-${Date.now()}.png`;

        const filePath = path.join(imagesFolder, fileName);

        fs.writeFileSync(
            filePath,
            Buffer.from(base64Data, "base64")
        );

        console.log(`Image received: ${fileName}`);

        res.json({
            success: true,
            message: "تم استقبال الصورة بنجاح"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء استقبال الصورة"
        });
    }
});

const SERVER_PORT = process.env.PORT || 3001;

app.get("/api/latest", (req, res) => {

    const files = fs.readdirSync(imagesFolder)
        .filter(file => file.endsWith(".png"))
        .map(file => ({
            name: file,
            time: fs.statSync(path.join(imagesFolder, file)).mtimeMs
        }))
        .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
        return res.status(404).send("لا توجد صور");
    }

    const latestImage = path.join(imagesFolder, files[0].name);

    res.sendFile(latestImage);
});

app.listen(SERVER_PORT, "0.0.0.0", () => {
    console.log(`CyberCam server running on port ${SERVER_PORT}`);
});