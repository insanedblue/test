import { useEffect } from 'react';
import { Modal, TextInput, Textarea, Select, NumberInput, Button, Group, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';
import { useProjectStore } from '../../store/projectStore';
import { useUIStore } from '../../store/uiStore';
import type { Task, TaskPriority, TaskStatus } from '../../types';
import { toISODate } from '../../utils/dates';

interface FormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  startDate: string | null;
  dueDate: string | null;
  estimatedHours: number | '';
  tags: string;
}

export function TaskModal() {
  const { openModalType, editingTaskId, activeProjectId, closeModal } = useUIStore(
    useShallow((s) => ({
      openModalType: s.openModalType,
      editingTaskId: s.editingTaskId,
      activeProjectId: s.activeProjectId,
      closeModal: s.closeModal,
    }))
  );
  const { tasks, members, createTask, updateTask } = useProjectStore(
    useShallow((s) => ({
      tasks: s.tasks,
      members: s.members,
      createTask: s.createTask,
      updateTask: s.updateTask,
    }))
  );

  const editingTask: Task | null = editingTaskId ? tasks[editingTaskId] : null;
  const isOpen = openModalType === 'task';

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assigneeId: '',
      startDate: null,
      dueDate: null,
      estimatedHours: '',
      tags: '',
    },
  });

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        assigneeId: editingTask.assigneeId ?? '',
        startDate: editingTask.startDate,
        dueDate: editingTask.dueDate,
        estimatedHours: editingTask.estimatedHours ?? '',
        tags: editingTask.tags.join(', '),
      });
    } else {
      reset({ title: '', description: '', status: 'todo', priority: 'medium', assigneeId: '', startDate: toISODate(new Date()), dueDate: null, estimatedHours: '', tags: '' });
    }
  }, [editingTask, isOpen, reset]);

  const memberOptions = Object.values(members).map((m) => ({ value: m.id, label: m.name }));

  const onSubmit = (data: FormValues) => {
    const projectId = editingTask?.projectId ?? activeProjectId ?? '';
    if (!projectId) return;

    const payload = {
      projectId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId || undefined,
      startDate: data.startDate ?? toISODate(new Date()),
      dueDate: data.dueDate ?? toISODate(new Date()),
      estimatedHours: typeof data.estimatedHours === 'number' ? data.estimatedHours : undefined,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      dependencies: editingTask?.dependencies ?? [],
    };

    if (editingTask) {
      updateTask(editingTask.id, payload);
    } else {
      createTask(payload);
    }
    closeModal();
  };

  const startDate = watch('startDate');
  const dueDate = watch('dueDate');
  const status = watch('status');
  const priority = watch('priority');
  const assigneeId = watch('assigneeId');

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      title={editingTask ? '태스크 수정' : '태스크 추가'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="제목"
            placeholder="태스크 제목"
            required
            {...register('title', { required: true })}
            error={errors.title ? '제목을 입력하세요' : undefined}
          />
          <Textarea
            label="설명"
            placeholder="태스크 설명"
            rows={3}
            {...register('description')}
          />
          <Group grow>
            <Select
              label="상태"
              value={status}
              onChange={(v) => setValue('status', v as TaskStatus)}
              data={[
                { value: 'todo', label: '할 일' },
                { value: 'in_progress', label: '진행 중' },
                { value: 'done', label: '완료' },
              ]}
            />
            <Select
              label="우선순위"
              value={priority}
              onChange={(v) => setValue('priority', v as TaskPriority)}
              data={[
                { value: 'low', label: '낮음' },
                { value: 'medium', label: '보통' },
                { value: 'high', label: '높음' },
                { value: 'urgent', label: '긴급' },
              ]}
            />
          </Group>
          <Select
            label="담당자"
            placeholder="담당자 선택"
            value={assigneeId || null}
            onChange={(v) => setValue('assigneeId', v ?? '')}
            data={memberOptions}
            clearable
          />
          <Group grow>
            <DateInput
              label="시작일"
              placeholder="시작일 선택"
              value={startDate}
              onChange={(v) => setValue('startDate', v)}
              valueFormat="YYYY-MM-DD"
            />
            <DateInput
              label="마감일"
              placeholder="마감일 선택"
              value={dueDate}
              onChange={(v) => setValue('dueDate', v)}
              valueFormat="YYYY-MM-DD"
            />
          </Group>
          <NumberInput
            label="예상 시간"
            placeholder="시간 (선택)"
            min={0}
            value={typeof watch('estimatedHours') === 'number' ? watch('estimatedHours') as number : ''}
            onChange={(v) => setValue('estimatedHours', v as number | '')}
          />
          <TextInput
            label="태그"
            placeholder="쉼표로 구분 (예: 디자인, UI)"
            {...register('tags')}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" onClick={closeModal}>취소</Button>
            <Button type="submit">{editingTask ? '수정' : '추가'}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
