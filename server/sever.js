const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// POST /check-seat
// Body: { train, from, to, date }
app.post("/check-seat", (req, res) => {
    const { train, from, to, date } = req.body;

    // Basic validation
    if (!train || !from || !to || !date) {
        return res.status(400).json({ error: "train, from, to, and date are required." });
    }
    // Spawn Python with args — seat_checker.py no longer uses input()
    const python = spawn("python", [
        "seat_checker.py",
        String(train),
        String(from),
        String(to),
        String(date),
    ]);

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    python.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

    python.on("close", (code) => {
        if (code !== 0) {
            console.error("seat_checker.py error:", stderr);
            return res.status(500).json({ error: "Seat checker failed.", detail: stderr });
        }

        try {
            const result = JSON.parse(stdout.trim());
            res.json(result);
        } catch {
            res.status(500).json({ error: "Invalid output from seat checker.", raw: stdout });
        }
    });

    python.on("error", (err) => {
        res.status(500).json({ error: "Failed to start Python process.", detail: err.message });
    });
});

// GET /predict-tatkal?seats=&day=&popularity=
// Forwards to the Flask tatkal_ai.py service
app.get("/predict-tatkal", async (req, res) => {
    const { seats = 10, day = "Monday", popularity = 5 } = req.query;

    try {
        const response = await fetch(
            `http://localhost:5000/predictTatkal?seats=${seats}&day=${day}&popularity=${popularity}`
        );
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(503).json({
            error: "AI prediction service unavailable. Make sure tatkal_ai.py is running.",
            detail: err.message,
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Tatkal Helper server running on http://localhost:${PORT}`);
});
