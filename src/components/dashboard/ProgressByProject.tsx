import { Card, Text } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { useActiveProjects } from '../../hooks/useProjects';
import { useAllTasks } from '../../hooks/useTasks';
import { statusHex } from '../../utils/colors';

export function ProgressByProject() {
  const projects = useActiveProjects();
  const allTasks = useAllTasks();

  const data = useMemo(() =>
    projects.map((p) => {
      const tasks = allTasks.filter((t) => t.projectId === p.id);
      return {
        name: p.name.length > 8 ? p.name.slice(0, 8) + '…' : p.name,
        '할 일': tasks.filter((t) => t.status === 'todo').length,
        '진행 중': tasks.filter((t) => t.status === 'in_progress').length,
        '완료': tasks.filter((t) => t.status === 'done').length,
      };
    }),
    [projects, allTasks]
  );

  return (
    <Card withBorder radius="md" p="lg">
      <Text fw={600} mb="md">프로젝트별 진행 현황</Text>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="할 일" stackId="a" fill={statusHex.todo} />
          <Bar dataKey="진행 중" stackId="a" fill={statusHex.in_progress} />
          <Bar dataKey="완료" stackId="a" fill={statusHex.done} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
