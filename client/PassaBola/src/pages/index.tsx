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
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-background">
      <BasicNavbar />

      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-6 sm:px-8">
        <section className="z-20 flex max-w-3xl flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs text-purple-600">
            <Icon
              className="text-purple-600"
              icon="solar:bolt-linear"
              width={16}
            />
            Passa a Bola
          </span>

          <h1 className="bg-hero-section-title bg-clip-text text-[clamp(36px,7vw,56px)] font-bold leading-[1.1] tracking-tight">
            Organize e participe dos campeonatos da Passa a Bola
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-purple-700 sm:text-[18px]">
            Crie ou entre em campeonatos, acompanhe seus próximos jogos, receba
            data e local das partidas e veja os resultados em tempo real. Faça
            login para continuar ou crie sua conta em poucos segundos.
          </p>

          <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              className="h-11 w-full bg-purple-600 font-medium text-white hover:bg-purple-700 sm:w-[170px]"
              radius="full"
              onPress={() => setIsSignupOpen(true)}
            >
              Criar conta
            </Button>

            <Button
              className="h-11 w-full border border-purple-300 font-medium text-purple-700 sm:w-[170px]"
              endContent={
                <span className="pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full bg-purple-100">
                  <Icon
                    className="text-purple-700 [&>path]:stroke-[1.5]"
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
            <Feature
              icon="solar:shield-check-linear"
              title="Inscrições simples"
            >
              Encontre campeonatos abertos e entre com 1 clique.
            </Feature>
            <Feature icon="solar:clock-circle-linear" title="Agenda de jogos">
              Receba data e local dos seus próximos jogos.
            </Feature>
            <Feature
              icon="solar:stars-minimalistic-linear"
              title="Resultados e chaves"
            >
              Acompanhe placares e avanço automático das fases.
            </Feature>
          </div>
        </section>

        <div className="pointer-events-none absolute inset-0 top-[-25%] z-10 scale-150 select-none sm:scale-125">
          <FadeInImage
            alt="Background com gradiente"
            src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/backgrounds/bg-gradient.png"
          />
        </div>
      </main>

      <footer className="z-20 mx-auto flex w-full max-w-5xl items-center justify-center gap-6 border-t border-purple-200 px-6 py-6 text-sm text-purple-700 sm:justify-between">
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
    <div className="rounded-large border border-purple-200 bg-purple-50/60 p-4 backdrop-blur supports-[backdrop-filter]:bg-purple-50/70">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="text-purple-600" icon={icon} width={18} />
        <h3 className="text-sm font-semibold text-purple-900">{title}</h3>
      </div>
      <p className="text-[13px] leading-6 text-purple-700">{children}</p>
    </div>
  );
}
