import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AifaPromo() {
  return (
    <section className="w-full mt-20 bg-black p-8 border-y-4 border-primary">
      <div className=" flex justify-center">
        <div className="container flex flex-col items-center justify-between gap-8 md:flex-row md:gap-16">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h2 className="mb-6 max-w-3xl font-serif text-xl font-bold leading-tight md:text-2xl lg:text-4xl ">
              Want to try AIFA AI Chat Starter?
            </h2>
            <p className="mb-12 max-w-xl text-base text-muted-foreground md:text-lg">
              Explore the power of AI-driven conversations. Get started for
              free!
            </p>

            <Link href="https://github.com/aifa-agi/aifa" passHref>
              <Button className="mt-8 rounded-full">Try it for free</Button>
            </Link>
          </div>
          <div className="relative shrink-0">
            <Image
              src="/_static/illustrations/git.png"
              width={300}
              height={300}
              alt="AIFA AI Chat Starter Octopus mascot"
              className="h-auto  max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
