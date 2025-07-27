export const config = {
  api: {
    bodyParser: false,
  },
};

import nextConnect from "next-connect";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { nanoid } from "nanoid";

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();
handler.use(upload.single("video"));

handler.post(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const formCatbox = new FormData();
  formCatbox.append("reqtype", "fileupload");
  formCatbox.append("fileToUpload", req.file.buffer, req.file.originalname);

  try {
    const resCat = await axios.post("https://catbox.moe/user/api.php", formCatbox, {
      headers: formCatbox.getHeaders(),
    });

    const catboxURL = resCat.data.trim();
    const id = nanoid(8);

    // GitHub Repo info
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = "Dazhosting/Save-Video";
    const FILE_PATH = "data/videos.json";

    const getRes = await axios.get(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    const oldData = JSON.parse(Buffer.from(getRes.data.content, "base64").toString());
    oldData.push({ id, name: req.file.originalname, url: catboxURL });

    await axios.put(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
      {
        message: `Add video ${id}`,
        content: Buffer.from(JSON.stringify(oldData, null, 2)).toString("base64"),
        sha: getRes.data.sha,
      },
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    res.status(200).json({ success: true, id, url: catboxURL });
  } catch (err) {
    console.error(err.message || err.response?.data);
    res.status(500).json({ error: "Upload or GitHub error" });
  }
});

export default handler;
                          
