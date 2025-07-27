import { useState } from "react";

export default function Home() {
  const [video, setVideo] = useState(null);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) return setMsg("Pilih video dulu.");

    const form = new FormData();
    form.append("video", video);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();

    if (res.ok) {
      setMsg(`✅ Video berhasil diupload! Lihat di /videos/${data.id}`);
    } else {
      setMsg("❌ Gagal upload: " + data.error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Video ke Catbox</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <button type="submit" style={{ marginLeft: 10 }}>Upload</button>
      </form>
      <p style={{ marginTop: 20 }}>{msg}</p>
    </div>
  );
            }
