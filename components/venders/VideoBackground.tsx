export default function VideoBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4"
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}