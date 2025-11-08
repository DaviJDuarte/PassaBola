import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import clsx from "clsx";

import api from "@/config/api.ts";

type Championship = {
  id: string;
  number_players: number;
  is_closed: boolean;
  name?: string;
};

type ChampionshipListResponse = {
  items: Championship[];
  page: number;
  page_size: number; // note snake_case if your backend uses it
  total: number;
};

export default function ChampionshipsListPage() {
  const [search, setSearch] = useState("");
  const [list, setList] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<ChampionshipListResponse>("/championships", {
        params: { status: "open" },
      });

      const { items } = res.data;

      setList(items ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = list.filter((c) =>
    (c.name ?? `Championship ${c.id}`)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const join = async (id: string) => {
    setJoiningId(id);
    try {
      await api.post(`/championships/${id}/join`, {});
    } catch (e) {
      console.error(e);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Campeonatos</h1>
          <p className="text-default-500">Entre em um campeonato aberto.</p>
        </div>
        <Input
          className="w-full sm:w-72"
          placeholder="Buscar..."
          radius="full"
          size="md"
          startContent={
            <Icon
              className="text-default-500"
              icon="solar:magnifer-linear"
              width={18}
            />
          }
          value={search}
          onValueChange={setSearch}
        />
      </div>

      {loading ? (
        <div className="rounded-large border border-default-100 bg-content1/50 p-6 text-default-500">
          Carregando campeonatos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-large border border-default-100 bg-content1/50 p-6 text-default-500">
          Nenhum campeonato aberto encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-large border border-default-100 bg-content1/60 p-4 backdrop-blur supports-[backdrop-filter]:bg-content1/70"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold">
                    {c.name ?? `Championship #${c.id}`}
                  </h3>
                  <p className="mt-1 text-sm text-default-500">
                    {c.number_players} jogadores por time
                  </p>
                </div>
                <span
                  className={clsx(
                    "rounded-full px-2 py-0.5 text-xs",
                    c.is_closed && "bg-success-100 text-success-700",
                    !c.is_closed && "bg-default-100 text-default-600",
                  )}
                >
                  {c.is_closed ? "Fechado" : "Aberto"}
                </span>
              </div>

              <Button
                className="mt-4 w-full"
                color="primary"
                isDisabled={c.is_closed}
                isLoading={joiningId === c.id}
                radius="full"
                startContent={
                  <Icon icon="solar:add-circle-linear" width={18} />
                }
                onPress={() => join(c.id)}
              >
                Entrar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
