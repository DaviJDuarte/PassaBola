import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import api from "@/config/api.ts";

type GameStats = {
  date: string;
  games_played: number;
  total_goals: number;
};

export default function DashboardStatsGraph() {
  const [stats, setStats] = useState<GameStats[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<GameStats[]>("/stats/recent");

      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="rounded-large border border-default-100 bg-content1/60 p-5 backdrop-blur supports-[backdrop-filter]:bg-content1/70">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon
            className="text-default-500"
            icon="solar:chart-linear"
            width={20}
          />
          <h3 className="text-base font-semibold">Estatísticas Recentes</h3>
        </div>
        <Button
          isIconOnly
          radius="lg"
          size="sm"
          variant="light"
          onPress={loadStats}
        >
          <Icon icon="solar:refresh-linear" width={18} />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-default-500">
          Carregando...
        </div>
      ) : stats.length > 0 ? (
        <ResponsiveContainer height={300} width="100%">
          <LineChart data={stats}>
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              dataKey="games_played"
              name="Jogos"
              stroke="#3B82F6"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="total_goals"
              name="Gols"
              stroke="#10B981"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-default-500">
          <Icon
            className="mb-2 opacity-50"
            icon="solar:chart-linear"
            width={48}
          />
          <p>Nenhuma estatística disponível</p>
        </div>
      )}
    </div>
  );
}
