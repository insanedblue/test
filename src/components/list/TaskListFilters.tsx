import { Group, MultiSelect, TextInput, Button } from '@mantine/core';
import { Search, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useUIStore } from '../../store/uiStore';

export function TaskListFilters() {
  const { filters, setFilters, resetFilters } = useUIStore(
    useShallow((s) => ({
      filters: s.filters,
      setFilters: s.setFilters,
      resetFilters: s.resetFilters,
    }))
  );

  const hasFilters =
    filters.statusFilter.length > 0 ||
    filters.priorityFilter.length > 0 ||
    filters.assigneeFilter.length > 0 ||
    filters.searchQuery.length > 0;

  return (
    <Group gap="sm" wrap="wrap">
      <TextInput
        placeholder="검색..."
        leftSection={<Search size={14} />}
        value={filters.searchQuery}
        onChange={(e) => setFilters({ searchQuery: e.currentTarget.value })}
        w={200}
        size="sm"
      />
      <MultiSelect
        placeholder="상태"
        value={filters.statusFilter}
        onChange={(v) => setFilters({ statusFilter: v as any })}
        data={[
          { value: 'todo', label: '할 일' },
          { value: 'in_progress', label: '진행 중' },
          { value: 'done', label: '완료' },
        ]}
        size="sm"
        w={150}
        clearable
      />
      <MultiSelect
        placeholder="우선순위"
        value={filters.priorityFilter}
        onChange={(v) => setFilters({ priorityFilter: v as any })}
        data={[
          { value: 'urgent', label: '긴급' },
          { value: 'high', label: '높음' },
          { value: 'medium', label: '보통' },
          { value: 'low', label: '낮음' },
        ]}
        size="sm"
        w={150}
        clearable
      />
      {hasFilters && (
        <Button variant="subtle" size="sm" leftSection={<X size={14} />} onClick={resetFilters}>
          초기화
        </Button>
      )}
    </Group>
  );
}
