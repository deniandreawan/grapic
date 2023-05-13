import Image from "next/image"
import Link from "next/link"

import { landingConfig } from "@/config/landing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default async function IndexPage() {
  return (
    <div className="mb-40 space-y-40">
      <div className="relative" id="home">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
        >
          <div className="h-56 bg-gradient-to-br from-purple-500 to-purple-400 blur-[106px] dark:from-blue-700"></div>
          <div className="h-32 bg-gradient-to-r from-cyan-400 to-sky-300 blur-[106px] dark:to-indigo-600"></div>
        </div>
        <div>
          <div className="relative ml-auto pt-48">
            <div className="mx-auto text-center lg:w-2/3">
              <h1 className="font-heading text-4xl  md:text-6xl xl:text-7xl">
                Make anything with{" "}
                <span className="text-indigo-500">
                  artificial intelligence.
                </span>
              </h1>
              <p className="text-md mt-8 text-slate-500 dark:text-slate-300">
                Grapic is a new kind of creative suite. One where AI is anything
                you can imagine can be created. Looking forward, Grapic has the
                potential to do much, much more.
              </p>
              <div className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-4">
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "flex w-full bg-indigo-600 hover:bg-indigo-700 sm:w-max"
                  )}
                >
                  <span className="relative text-base font-semibold text-white">
                    Start for free
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="features">
        <div>
          <div className="md:w-2/3 lg:w-1/2">
            <Icons.star className="h-6 w-6 text-orange-400" />
            <h2 className="my-8 font-heading text-2xl font-bold text-slate-700 dark:text-white md:text-4xl">
              AI made for everyone.
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Browse our full suite of AI Magic Tools that make it easier than
              ever to ideas, iterate, and generate content.
            </p>
          </div>
          <div className="mt-16 grid divide-x divide-y overflow-hidden rounded-3xl border  text-slate-600 dark:divide-slate-700 dark:border-slate-700 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 xl:grid-cols-4">
            {landingConfig.features.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white transition last:bg-slate-50 hover:z-[1] hover:shadow-2xl hover:shadow-slate-600/10 dark:bg-slate-800 last:dark:bg-slate-900 last:dark:hover:bg-slate-800"
              >
                <div className="relative space-y-8 p-8 py-12">
                  <Image
                    src={item.icon}
                    className="w-12"
                    width="512"
                    height="512"
                    alt=""
                  />

                  <div className="space-y-2">
                    <h5 className="font-heading text-xl text-slate-700 transition group-hover:text-indigo-500 dark:text-white">
                      {item.title}
                    </h5>
                    <p className="text-slate-600 dark:text-slate-300">
                      {item.descriptions}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
