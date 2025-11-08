import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@heroui/input";
import { DateInput } from "@heroui/date-input";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { parseDateTime, CalendarDateTime } from "@internationalized/date"; // <-- needed

import api from "@/config/api.ts";

type Game = {
  id: string;
  championship_id: string;
  date?: string;
  location?: string;
  home_team?: string;
  away_team?: string;
  home_score?: number;
  away_score?: number;
  status: "scheduled" | "completed" | "pending";
};

export default function AdminGameEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);

  // fix: DateInput expects CalendarDateTime (not string)
  const [date, setDate] = useState<CalendarDateTime | null>(null);
  const [location, setLocation] = useState("");
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [savingScore, setSavingScore] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get<Game>(`/games/${id}`);

      setGame(data);

      // Convert API string date → CalendarDateTime
      if (data.date) {
        setDate(parseDateTime(data.date));
      } else {
        setDate(null);
      }

      setLocation(data.location ?? "");
      setHomeScore(data.home_score?.toString() ?? "");
      setAwayScore(data.away_score?.toString() ?? "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const saveSchedule = async () => {
    if (!id) return;
    setSavingSchedule(true);
    try {
      const { data } = await api.patch<Game>(`/games/${id}/schedule`, {
        date: date ? date.toString() : null, // send ISO-like string
        location,
      });

      setGame(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSchedule(false);
    }
  };

  const saveScore = async () => {
    if (!id) return;
    if (homeScore === "" || awayScore === "") return;
    setSavingScore(true);
    try {
      const { data } = await api.patch<Game>(`/games/${id}/score`, {
        home_score: Number(homeScore),
        away_score: Number(awayScore),
      });

      setGame(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingScore(false);
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

  if (!game) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="rounded-large border border-default-100 bg-content1/50 p-6 text-default-500">
          Jogo não encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Jogo #{game.id}</h1>
          <p className="text-default-500">
            {game.home_team ?? "Home"} vs {game.away_team ?? "Away"} •
            Campeonato #{game.championship_id}
          </p>
        </div>
      </div>

      <section className="rounded-large border border-default-100 bg-content1/60 p-6">
        <h2 className="text-lg font-medium">Agendamento</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DateInput
            granularity="minute"
            label="Data"
            radius="lg"
            value={date}
            onChange={setDate}
          />

          <Input
            label="Local"
            radius="lg"
            value={location}
            onValueChange={setLocation}
          />
        </div>
        <Button
          className="mt-4"
          color="primary"
          isLoading={savingSchedule}
          radius="lg"
          startContent={<Icon icon="solar:calendar-linear" width={18} />}
          onPress={saveSchedule}
        >
          Salvar agendamento
        </Button>
      </section>

      <section className="rounded-large border border-default-100 bg-content1/60 p-6">
        <h2 className="text-lg font-medium">Resultado</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={`${game.home_team ?? "Home"} (placar)`}
            min={0}
            radius="lg"
            type="number"
            value={homeScore}
            onValueChange={setHomeScore}
          />
          <Input
            label={`${game.away_team ?? "Away"} (placar)`}
            min={0}
            radius="lg"
            type="number"
            value={awayScore}
            onValueChange={setAwayScore}
          />
        </div>
        <Button
          className="mt-4"
          color="secondary"
          isLoading={savingScore}
          radius="lg"
          startContent={<Icon icon="solar:trophy-linear" width={18} />}
          onPress={saveScore}
        >
          Enviar placar
        </Button>
      </section>
    </div>
  );
}
