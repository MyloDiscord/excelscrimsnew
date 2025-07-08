import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Success() {
  return (
    <div className="relative min-h-screen bg-[#121212] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>
    </div>
  );
}
