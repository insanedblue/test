import { Stack, Text, Button } from '@mantine/core';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <Stack align="center" gap="md" py="xl">
      <Icon size={48} strokeWidth={1} color="var(--mantine-color-gray-5)" />
      <Stack align="center" gap={4}>
        <Text fw={500} c="dimmed">{title}</Text>
        {description && <Text size="sm" c="dimmed">{description}</Text>}
      </Stack>
      {action && (
        <Button variant="light" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Stack>
  );
}
