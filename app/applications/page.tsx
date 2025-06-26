import { BackgroundBeams } from "@/components/ui/background-beams";

export default function ApplicationsPage() {
  return (
    <div className="relative min-h-screen bg-[#121212] flex flex-col justify-center items-center p-6 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>
    </div>
  );
}
