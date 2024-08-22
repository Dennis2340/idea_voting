import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { RegisterLink, getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Share Your Vision with <span className="text-blue-500">IdeaVote</span>
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          Pitch your ideas, vote on others, and help bring the best concepts to life.
        </p>

        {!user ? (
          <>
            <RegisterLink className={buttonVariants({ size: "lg", className: "mt-5" })}>
              Get Started <ArrowRight className="ml-1.5 h-5 w-5" />
            </RegisterLink>
          </>
        ) : (
          <>
            <Link
              className={buttonVariants({
                size: "lg",
                className: "mt-5",
              })}
              href="/dashboard"
            >
              Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </>
        )}
      </MaxWidthWrapper>

      <div className="mx-auto mt-32 max-w-5xl sm:mt-26">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Join the Idea Revolution
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Vote on groundbreaking ideas or pitch your own. Your input can shape the future!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center justify-center px-6 lg:px-8 mb-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Vote on Ideas</h3>
            <p className="text-lg text-gray-700">
              Explore ideas pitched by others and vote on their potential. Your vote helps prioritize the best concepts.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Pitch Your Ideas</h3>
            <p className="text-lg text-gray-700">
              Have a vision for the future? Pitch your idea and see how the community responds.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
