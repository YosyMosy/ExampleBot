import BaseClient from "./client.js";
import config from "./config.js";
const app = express();
const PORT = process.env.PORT ||3000;

// Membuat endpoint dummy agar Render mendeteksi aplikasi web aktif
app.get("/", (req, res) => {
    res.send("Bot berjalan 24/7");
});

app.listen(PORT, () => {
    console.log("Server Express mendengarkan di port ${PORT}");
});

const token = config.token;
const client = new BaseClient(token);

client.start();
