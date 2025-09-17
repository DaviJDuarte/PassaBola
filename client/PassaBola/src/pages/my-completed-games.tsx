import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import api from "@/config/api.ts";

type Game = {
  id: string;
  championship_id: string;
  home_team?: string;
  away_team?: string;
  home_score?: number;
  away_score?: number;
  date?: string;
  location?: string;
  status: "scheduled" | "completed" | "pending";
};

export default function MyCompletedGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get<Game[]>("/me/games", {
          params: { status: "completed" },
        });

        setGames(data ?? []);
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
        <h1 className="text-2xl font-semibold">Jogos concluídos</h1>
        <p className="text-default-500">Resultados dos jogos finalizados.</p>
      </div>

      {loading ? (
        <div className="rounded-large border border-default-100 bg-content1/50 p-6 text-default-500">
          Carregando jogos...
        </div>
      ) : games.length === 0 ? (
        <div className="rounded-large border border-default-100 bg-content1/50 p-6 text-default-500">
          Nenhum jogo concluído ainda.
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
                  {g.home_team ?? "Home"} {g.home_score ?? 0} -{" "}
                  {g.away_score ?? 0} {g.away_team ?? "Away"}
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-default-500">
                  <span className="inline-flex items-center gap-1">
                    <Icon icon="solar:calendar-linear" width={16} />
                    {g.date ? new Date(g.date).toLocaleString() : "Sem data"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon icon="solar:map-point-linear" width={16} />
                    {g.location ?? "Sem local"}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-success-50 px-2 py-0.5 text-xs text-success-700">
                Finalizado
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
