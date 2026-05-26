import { Avatar, Tooltip } from '@mantine/core';
import { useProjectStore } from '../../store/projectStore';

interface Props {
  memberId?: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withTooltip?: boolean;
}

export function UserAvatar({ memberId, size = 'sm', withTooltip = false }: Props) {
  const member = useProjectStore((s) => (memberId ? s.members[memberId] : null));

  if (!member) return <Avatar size={size} radius="xl" />;

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatar = (
    <Avatar size={size} radius="xl" color={member.color} style={{ backgroundColor: member.color }}>
      {initials}
    </Avatar>
  );

  if (withTooltip) return <Tooltip label={member.name}>{avatar}</Tooltip>;
  return avatar;
}
