/*
AI Declaration:
I used Gemini to help debug the table structure in my invoice layout.
I wrote all the other code, and I understand the entire implementation.

Reflection:
[ I learned how to connect an API to my code, and I also learned how to write functions to fetch, execute, and handle any errors that occurred.
  I also learned how to solve problems that came from my lack of understanding of the basics at first. In the end I managed to complete it successfully. Thank you to Aj. Wudhichart for all the help ka/\ ]
*/
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
    console.log(`Request at ${req.url}`);
});
app.use(express.static(path.join(__dirname, "..")));
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=main.js.map