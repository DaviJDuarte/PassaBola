import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import api from "@/config/api.ts";

type Championship = {
  id: string;
  number_players: number;
  status: "open" | "closed" | "ongoing" | "completed";
  name?: string;
};

type ChampionshipListResponse = {
  items: Championship[];
  page: number;
  page_size: number;
  total: number;
};

export default function AdminChampionshipsPage() {
  const [list, setList] = useState<Championship[]>([]);
  const [ppt, setPpt] = useState<number | "">(6);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } =
        await api.get<ChampionshipListResponse>(`/championships`);

      setList(data.items ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (ppt === "" || Number(ppt) < 1) return;
    if (!name.trim()) return;
    setCreating(true);
    try {
      await api.post(`/championships`, {
        number_players: Number(ppt),
        name: name.trim(),
      });
      await load();
      setPpt(2);
      setName("");
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gerenciar Campeonatos</h1>
          <p className="text-default-500">
            Crie e administre seus campeonatos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            className="w-64"
            label="Nome do campeonato"
            radius="lg"
            value={name}
            onValueChange={setName}
          />
          <Input
            className="w-48"
            label="Jogadores por time"
            min={1}
            radius="lg"
            type="number"
            value={ppt.toString()}
            onValueChange={(v) => setPpt(v === "" ? "" : Number(v))}
          />
          <Button
            color="primary"
            isLoading={creating}
            radius="lg"
            startContent={<Icon icon="solar:add-circle-linear" width={18} />}
            onPress={create}
          >
            Criar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-large border border-default-100 bg-content1/50 p-6 text-default-500">
          Carregando campeonatos...
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-large border border-default-100 bg-content1/60 p-4"
            >
              <div>
                <div className="font-medium">
                  {c.name ?? `Championship #${c.id}`}
                </div>
                <div className="mt-1 text-sm text-default-500">
                  {c.number_players} por time • {c.status}
                </div>
              </div>
              <Button
                endContent={
                  <Icon icon="solar:arrow-right-up-linear" width={18} />
                }
                radius="lg"
                variant="bordered"
                onPress={() => nav(`/admin/championships/${c.id}`)}
              >
                Gerenciar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
