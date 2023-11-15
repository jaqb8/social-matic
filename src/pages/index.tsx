import { useUser } from "@clerk/nextjs";
import Head from "next/head";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Webhook, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { createRef, useEffect, useState } from "react";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import PricingCard from "@/components/pricing-card";

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = createRef<HTMLDivElement>();

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks();
    };
  }, []);

  if (!userLoaded) {
    return <div />;
  }

  if (userLoaded && isSignedIn) {
    router.push("dashboard");
  }

  const showMobileMenu = () => {
    setMobileMenuOpen(true);
    if (mobileMenuRef.current) {
      disableBodyScroll(mobileMenuRef.current);
    }
  };

  const hideMobileMenu = () => {
    setMobileMenuOpen(false);
    if (mobileMenuRef.current) {
      enableBodyScroll(mobileMenuRef.current);
    }
  };

  return (
    <>
      <Head>
        <title>SocialMatic</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        ref={mobileMenuRef}
        className={`${
          !isMobileMenuOpen && "hidden"
        } fixed bottom-0 left-0 top-0 w-full bg-slate-900 pr-[15px]`}
      >
        <div className="flex items-end justify-between px-10 py-5 text-slate-100">
          <div className="text-md flex cursor-pointer items-center gap-2 font-semibold tracking-wide transition duration-500 hover:scale-105">
            <Webhook size={20} />
            SocialMatic
          </div>
          <div className="cursor-pointer p-1 hover:rounded-md hover:bg-slate-100 hover:bg-opacity-10">
            <X size={22} onClick={hideMobileMenu} />
          </div>
        </div>
        <div className="flex h-screen flex-col items-center gap-10 pt-10 text-3xl font-bold text-slate-100">
          <Link href="#pricing" onClick={hideMobileMenu}>
            Pricing
          </Link>
          <Link href="#plans" onClick={hideMobileMenu}>
            Plans
          </Link>
        </div>
      </div>

      <main className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black text-slate-100">
        <nav className="hidden items-center justify-between px-24 py-5 sm:flex">
          <div className="flex cursor-pointer gap-2 text-lg font-semibold tracking-wide transition duration-500 hover:scale-110">
            <Webhook size={24} />
            SocialMatic
          </div>
          <div className="flex gap-6">
            <div>
              <Link href="#pricing">
                <Button className="text-secondary" variant="link">
                  Pricing
                </Button>
              </Link>
            </div>
            <div>
              <Link href="#plans">
                <Button className="text-secondary" variant="link">
                  Plans
                </Button>
              </Link>
            </div>
          </div>
          <Link href="dashboard">
            <div className="flex cursor-pointer rounded-full border bg-cyan-600 bg-opacity-5 px-4 py-1 transition duration-500 hover:scale-110 hover:bg-opacity-20 hover:drop-shadow-lg">
              Go to App <ChevronRight />
            </div>
          </Link>
        </nav>

        <nav
          className={`${
            !isMobileMenuOpen && "absolute"
          } flex w-full items-end justify-between px-10 py-5 sm:hidden`}
        >
          <div className="text-md flex cursor-pointer items-center gap-2 font-semibold tracking-wide transition duration-500 hover:scale-105">
            <Webhook size={20} />
            SocialMatic
          </div>
          <div
            onClick={showMobileMenu}
            className="cursor-pointer p-1 hover:rounded-md hover:bg-slate-100 hover:bg-opacity-10"
          >
            <Menu size={22} />
          </div>
        </nav>

        <Main />
        <Pricing />
        <Plans />
      </main>
    </>
  );
}

const Main = () => {
  return (
    <section className="flex h-screen flex-col justify-center">
      <div className="flex">
        <div className="flex flex-col gap-2 p-10 text-[3.3rem] font-bold tracking-wide sm:text-6xl">
          <span className="bg-gradient-to-r from-cyan-300 to-green-400 bg-clip-text italic text-transparent">
            Supercharged
          </span>
          <span className="text-4xl font-bold tracking-wider">
            social media productivity
          </span>
          <p className="text-lg font-thin text-slate-300">
            Meet <span className="font-normal">SocialMatic</span>, the social
            media content scheduler for many different platforms. Focus on
            creating, not managing 10 different accounts. Free for individuals.
          </p>
        </div>
      </div>
      <Link className="px-10" href="dashboard">
        <div className="flex w-44 cursor-pointer justify-center rounded-full border bg-cyan-600 bg-opacity-5 px-4 py-1 transition duration-500 hover:scale-110 hover:bg-opacity-20 hover:drop-shadow-lg">
          Go to App <ChevronRight />
        </div>
      </Link>
    </section>
  );
};
const Pricing = () => {
  const cards = [
    {
      name: "Free",
      description: "Everything you need to supercharge your social media.",
      price: 0,
      buttonText: "Sign up now!",
      features: [
        "2 social media account",
        "1 user",
        "10 posts per month",
        "Basic analytics",
      ],
    },
    {
      name: "Lite",
      description: "Everything you need to supercharge your social media.",
      price: 9,
      buttonText: "Coming soon!",
      features: [
        "4 social media account",
        "1 user",
        "100 posts per month",
        "Basic analytics",
      ],
      buttonDisabled: true,
    },
    {
      name: "Pro",
      description: "Everything you need to supercharge your social media.",
      price: 19,
      buttonText: "Coming soon!",
      features: [
        "Unlimited social media account",
        "1 user",
        "Unlimited posts per month",
        "Extended analytics",
      ],
      buttonDisabled: true,
    },
  ];

  return (
    <section id="pricing" className="flex flex-col items-center gap-20 py-12">
      <div className="text-7xl font-semibold tracking-wider">Pricing</div>
      <div className="flex w-full flex-col gap-6 px-12 lg:flex-row">
        {cards.map((card) => (
          <PricingCard key={card.name} {...card} />
        ))}
      </div>
    </section>
  );
};

const Plans = () => {
  return (
    <section id="plans" className="flex h-screen justify-center py-24">
      <div className="text-7xl font-semibold tracking-wider">Plans</div>
    </section>
  );
};
