import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

import api from "@/config/api.ts";

type Championship = {
  id: string;
  players_per_team: number;
  status: "open" | "closed" | "ongoing" | "completed";
  name?: string;
};

export default function AdminChampionshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [c, setC] = useState<Championship | null>(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const nav = useNavigate();

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get<Championship>(`/championships/${id}`);

      setC(data ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const closeSignups = async () => {
    if (!id) return;
    setClosing(true);
    try {
      await api.post(`/championships/${id}/close_signups`, {});
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="rounded-large border border-default-100 bg-content1/50 p-6 text-default-500">
          Carregando...
        </div>
      </div>
    );
  }

  if (!c) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="rounded-large border border-default-100 bg-content1/50 p-6 text-default-500">
          Campeonato não encontrado.
        </div>
      </div>
    );
  }

  const canClose = c.status === "open";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {c.name ?? `Championship #${c.id}`}
          </h1>
          <p className="text-default-500">
            {c.players_per_team} jogadores por time • Status: {c.status}
          </p>
        </div>
        <Button
          radius="lg"
          startContent={<Icon icon="solar:alt-arrow-left-linear" width={18} />}
          variant="bordered"
          onPress={() => nav("/admin/championships")}
        >
          Voltar
        </Button>
      </div>

      <div className="rounded-large border border-default-100 bg-content1/60 p-6">
        <h2 className="text-lg font-medium">Inscrições</h2>
        <p className="mt-1 text-sm text-default-500">
          Feche as inscrições para gerar automaticamente os jogos da primeira
          fase.
        </p>
        <Button
          className="mt-4"
          color="primary"
          isDisabled={!canClose}
          isLoading={closing}
          radius="lg"
          startContent={<Icon icon="solar:shield-check-linear" width={18} />}
          onPress={closeSignups}
        >
          Fechar inscrições e gerar jogos
        </Button>
      </div>
    </div>
  );
}
