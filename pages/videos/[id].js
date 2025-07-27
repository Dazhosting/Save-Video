import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/videos/${id}`)
      .then((res) => res.json())
      .then((data) => setVideo(data));
  }, [id]);

  if (!video) return <p>Memuat video...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{video.name}</h2>
      <video src={video.url} controls width="600" />
      <p>ID: {video.id}</p>
    </div>
  );
}
