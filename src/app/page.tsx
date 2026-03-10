import { Navbar } from "@/components/common/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-4xl font-bold text-primary">
          Welcome to Eventify!
        </h1>
      </main>
    </div>
  );
}
