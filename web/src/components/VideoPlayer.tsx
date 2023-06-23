import "video-react/dist/video-react.css";
import { Player } from "video-react";

export function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  return <Player playsInline src={videoUrl} />;
}
