import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { ReactNode, useState } from "react";

import FadeInImage from "@/components/fade-in-image";
import LoginModal from "@/components/modals/login-modal";
import SignupModal from "@/components/modals/signup-modal";
import BasicNavbar from "@/components/basic-navbar.tsx";

export default function Component() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="bg-background relative flex min-h-dvh w-full flex-col overflow-hidden">
      <BasicNavbar />

      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-6 sm:px-8">
        <section className="z-20 flex max-w-3xl flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-default-100 bg-default-50 px-3 py-1 text-xs text-default-500">
            <Icon
              className="text-default-500"
              icon="solar:bolt-linear"
              width={16}
            />
            Olá
          </span>

          <h1 className="bg-hero-section-title bg-clip-text text-[clamp(36px,7vw,56px)] font-bold leading-[1.1] tracking-tight">
            Participe dos campeonatos da Passa a Bola
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-default-500 sm:text-[18px]">
            A simple workspace to plan, collaborate, and manage work. Sign in to
            continue or create a free account to get started in minutes.
          </p>

          <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              className="h-11 w-full sm:w-[170px] bg-default-foreground text-background font-medium"
              radius="full"
              onPress={() => setIsSignupOpen(true)}
            >
              Criar conta
            </Button>

            <Button
              className="h-11 w-full sm:w-[170px] border-default-100 font-medium"
              endContent={
                <span className="bg-default-100 pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full">
                  <Icon
                    className="text-default-500 [&>path]:stroke-[1.5]"
                    icon="solar:arrow-right-linear"
                    width={16}
                  />
                </span>
              }
              radius="full"
              variant="bordered"
              onPress={() => setIsLoginOpen(true)}
            >
              Entrar
            </Button>
          </div>

          <div className="mt-8 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <Feature icon="solar:shield-check-linear" title="Secure">
              Enterprise-grade security out of the box.
            </Feature>
            <Feature icon="solar:clock-circle-linear" title="Fast">
              Optimized for speed and reliability.
            </Feature>
            <Feature icon="solar:stars-minimalistic-linear" title="Simple">
              Clean UI with zero clutter.
            </Feature>
          </div>
        </section>

        <div className="pointer-events-none absolute inset-0 top-[-25%] z-10 scale-150 select-none sm:scale-125">
          <FadeInImage
            alt="Gradient background"
            src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/backgrounds/bg-gradient.png"
          />
        </div>
      </main>

      <footer className="z-20 mx-auto flex w-full max-w-5xl items-center justify-center gap-6 border-t border-default-100 px-6 py-6 text-sm text-default-500 sm:justify-between">
        <p className="hidden sm:block">
          © {new Date().getFullYear()} Passa a Bola
        </p>
      </footer>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSuccess={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}

type FeatureProps = {
  icon: string;
  title: string;
  children: ReactNode;
};

function Feature({ icon, title, children }: FeatureProps) {
  return (
    <div className="rounded-large border border-default-100 bg-content1/50 p-4 backdrop-blur supports-[backdrop-filter]:bg-content1/60">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="text-default-500" icon={icon} width={18} />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-[13px] leading-6 text-default-500">{children}</p>
    </div>
  );
}
