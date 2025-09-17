import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

type Championship = {
  id: string;
  players_per_team: number;
  status: "open" | "closed" | "ongoing" | "completed";
  name?: string;
};

export default function AdminChampionshipsPage() {
  const [list, setList] = useState<Championship[]>([]);
  const [ppt, setPpt] = useState<number | "">(2);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/championships`);
      const data = await res.json();

      setList(data ?? []);
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
    setCreating(true);
    try {
      await fetch(`/championships`, {
        method: "POST",
        body: JSON.stringify({ players_per_team: Number(ppt) }),
      });
      await load();
      setPpt(2);
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
                  {c.players_per_team} por time • {c.status}
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
