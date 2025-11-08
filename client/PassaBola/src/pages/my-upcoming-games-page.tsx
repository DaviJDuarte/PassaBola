import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";

import api from "@/config/api.ts";

type Game = {
  id: string;
  championship_id: string;
  date?: string;
  location?: string;
  home_team?: string;
  away_team?: string;
  status: "scheduled" | "completed" | "pending";
};

type UpcomingGamesResponse = {
  items: Game[];
  page: number;
  page_size: number;
  total: number;
};

export default function MyUpcomingGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get<UpcomingGamesResponse>("/me/games", {
          params: { status: "upcoming" },
        });

        setGames(data.items ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Próximos jogos</h1>
        <p className="text-default-500">
          Datas e locais dos seus próximos jogos.
        </p>
      </div>

      {loading ? (
        <div className="rounded-large border border-default-100 bg-content1/50 p-6 text-default-500">
          Carregando jogos...
        </div>
      ) : games.length === 0 ? (
        <div className="rounded-large border border-default-100 bg-content1/50 p-6 text-default-500">
          Você não possui jogos agendados.
        </div>
      ) : (
        <div className="space-y-3">
          {games.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between rounded-large border border-default-100 bg-content1/60 p-4"
            >
              <div>
                <div className="font-medium">
                  {g.home_team ?? "Home"} vs {g.away_team ?? "Away"}
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-default-500">
                  <span className="inline-flex items-center gap-1">
                    <Icon icon="solar:calendar-linear" width={16} />
                    {g.date
                      ? new Date(g.date).toLocaleString()
                      : "Data a definir"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon icon="solar:map-point-linear" width={16} />
                    {g.location ?? "Local a definir"}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700">
                #{g.championship_id}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Button
          radius="full"
          startContent={<Icon icon="solar:clock-circle-linear" width={18} />}
          variant="bordered"
          onPress={() => (window.location.href = "/app/me/games/completed")}
        >
          Ver jogos concluídos
        </Button>
      </div>
    </div>
  );
}
