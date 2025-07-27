import axios from "axios";

export default async function handler(req, res) {
  const { id } = req.query;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "Dazhosting/Save-Video";
  const FILE_PATH = "data/videos.json";

  try {
    const getRes = await axios.get(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    const data = JSON.parse(Buffer.from(getRes.data.content, "base64").toString());
    const video = data.find((v) => v.id === id);

    if (!video) return res.status(404).json({ error: "Video not found" });

    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ error: "GitHub error" });
  }
}
