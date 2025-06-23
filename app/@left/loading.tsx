import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-white">
      {/* Иллюстрация */}
      <Image
        src="/_static/illustrations/work-from-home.jpg"
        alt="Work from Home Illustration"
        width={320}
        height={240}
        priority
        className="mb-6 "
      />
      {/* Приветственный текст */}
      <h1 className="text-primary text-2xl font-semibold whitespace-pre-wrap mx-4 text-center">
        Welcome to the Ai-First user interface concept
      </h1>
      <p className="text-black text-xl mt-4">Loading ...</p>
    </div>
  );
}
