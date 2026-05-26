import { Card, Text } from '@mantine/core';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { useTasksForProject } from '../../hooks/useTasks';
import { priorityHex } from '../../utils/colors';

const PRIORITY_LABELS = { low: '낮음', medium: '보통', high: '높음', urgent: '긴급' };

interface Props {
  projectId: string | null;
}

export function TasksByPriority({ projectId }: Props) {
  const tasks = useTasksForProject(projectId);

  const data = useMemo(() =>
    (Object.keys(PRIORITY_LABELS) as Array<keyof typeof PRIORITY_LABELS>)
      .map((p) => ({ name: PRIORITY_LABELS[p], value: tasks.filter((t) => t.priority === p).length, color: priorityHex[p] }))
      .filter((d) => d.value > 0),
    [tasks]
  );

  return (
    <Card withBorder radius="md" p="lg">
      <Text fw={600} mb="md">우선순위 분포</Text>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
