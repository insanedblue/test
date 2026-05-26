import { Group, SegmentedControl, Text } from '@mantine/core';
import { useShallow } from 'zustand/react/shallow';
import { useUIStore } from '../../store/uiStore';
import type { ViewMode } from '../../types';

const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: 'Day', label: '일' },
  { value: 'Week', label: '주' },
  { value: 'Month', label: '월' },
  { value: 'Year', label: '연' },
];

export function GanttToolbar() {
  const { ganttViewMode, setGanttViewMode } = useUIStore(
    useShallow((s) => ({
      ganttViewMode: s.ganttViewMode,
      setGanttViewMode: s.setGanttViewMode,
    }))
  );

  return (
    <Group justify="space-between">
      <Text fw={600}>간트 차트</Text>
      <SegmentedControl
        size="sm"
        value={ganttViewMode}
        onChange={(v) => setGanttViewMode(v as ViewMode)}
        data={VIEW_MODES.map((m) => ({ value: m.value, label: m.label }))}
      />
    </Group>
  );
}
