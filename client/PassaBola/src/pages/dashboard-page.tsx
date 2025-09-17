import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "").toLowerCase();

  function handleSignOut() {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button
          radius="lg"
          startContent={<Icon icon="solar:logout-2-linear" width={18} />}
          variant="flat"
          onPress={handleSignOut}
        >
          Sair
        </Button>
      </div>

      <div className="mx-auto mt-6 w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-large border border-default-100 bg-content1/60 p-5 backdrop-blur supports-[backdrop-filter]:bg-content1/70">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  className="text-default-500"
                  icon="solar:trophy-linear"
                  width={20}
                />
                <h3 className="text-base font-semibold">Campeonatos</h3>
              </div>
            </div>
            <p className="mt-1 text-sm text-default-500">
              Entre em campeonatos abertos e participe.
            </p>
            <Button
              className="mt-4 w-full"
              color="primary"
              endContent={
                <Icon icon="solar:arrow-right-up-linear" width={18} />
              }
              radius="lg"
              onPress={() => navigate("/app/championships")}
            >
              Ver campeonatos
            </Button>
          </div>

          <div className="rounded-large border border-default-100 bg-content1/60 p-5 backdrop-blur supports-[backdrop-filter]:bg-content1/70">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  className="text-default-500"
                  icon="solar:calendar-linear"
                  width={20}
                />
                <h3 className="text-base font-semibold">Próximos jogos</h3>
              </div>
            </div>
            <p className="mt-1 text-sm text-default-500">
              Datas e locais dos seus jogos agendados.
            </p>
            <Button
              className="mt-4 w-full"
              endContent={
                <Icon icon="solar:arrow-right-up-linear" width={18} />
              }
              radius="lg"
              variant="bordered"
              onPress={() => navigate("/app/me/games/upcoming")}
            >
              Ver próximos
            </Button>
          </div>

          <div className="rounded-large border border-default-100 bg-content1/60 p-5 backdrop-blur supports-[backdrop-filter]:bg-content1/70">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  className="text-default-500"
                  icon="solar:flag-linear"
                  width={20}
                />
                <h3 className="text-base font-semibold">Jogos concluídos</h3>
              </div>
            </div>
            <p className="mt-1 text-sm text-default-500">
              Resultados e histórico de partidas finalizadas.
            </p>
            <Button
              className="mt-4 w-full"
              endContent={
                <Icon icon="solar:arrow-right-up-linear" width={18} />
              }
              radius="lg"
              variant="bordered"
              onPress={() => navigate("/app/me/games/completed")}
            >
              Ver concluídos
            </Button>
          </div>

          {/* Visível só pra admin */}
          {role === "admin" && (
            <div className="rounded-large border border-default-100 bg-content1/60 p-5 backdrop-blur supports-[backdrop-filter]:bg-content1/70 lg:col-span-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    className="text-default-500"
                    icon="solar:shield-check-linear"
                    width={20}
                  />
                  <h3 className="text-base font-semibold">Administração</h3>
                </div>
              </div>
              <p className="mt-1 text-sm text-default-500">
                Criar campeonatos, encerrar inscrições, agendar partidas e
                lançar placares.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  color="secondary"
                  radius="lg"
                  startContent={
                    <Icon icon="solar:add-circle-linear" width={18} />
                  }
                  onPress={() => navigate("/admin/championships")}
                >
                  Gerenciar campeonatos
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
