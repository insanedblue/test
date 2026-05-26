import { useEffect } from 'react';
import { Modal, TextInput, Textarea, Select, Button, Group, Stack } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';
import { useProjectStore } from '../../store/projectStore';
import { useUIStore } from '../../store/uiStore';

interface FormValues {
  name: string;
  description: string;
  color: string;
}

const COLOR_OPTIONS = [
  { value: 'blue', label: '파랑' },
  { value: 'violet', label: '보라' },
  { value: 'green', label: '초록' },
  { value: 'orange', label: '주황' },
  { value: 'red', label: '빨강' },
  { value: 'teal', label: '청록' },
  { value: 'pink', label: '분홍' },
  { value: 'indigo', label: '남색' },
];

export function ProjectModal() {
  const { openModalType, editingProjectId, closeModal } = useUIStore(
    useShallow((s) => ({
      openModalType: s.openModalType,
      editingProjectId: s.editingProjectId,
      closeModal: s.closeModal,
    }))
  );
  const { projects, members, createProject, updateProject } = useProjectStore(
    useShallow((s) => ({
      projects: s.projects,
      members: s.members,
      createProject: s.createProject,
      updateProject: s.updateProject,
    }))
  );

  const editingProject = editingProjectId ? projects[editingProjectId] : null;
  const isOpen = openModalType === 'project';

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { name: '', description: '', color: 'blue' },
  });

  useEffect(() => {
    if (editingProject) {
      reset({ name: editingProject.name, description: editingProject.description, color: editingProject.color });
    } else {
      reset({ name: '', description: '', color: 'blue' });
    }
  }, [editingProject, isOpen, reset]);

  const memberList = Object.values(members);
  const ownerId = memberList[0]?.id ?? '';

  const onSubmit = (data: FormValues) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      createProject({ ...data, ownerId, memberIds: memberList.map((m) => m.id), archivedAt: undefined });
    }
    closeModal();
  };

  const color = watch('color');

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      title={editingProject ? '프로젝트 수정' : '프로젝트 추가'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="프로젝트 이름"
            placeholder="프로젝트 이름"
            required
            {...register('name', { required: true })}
            error={errors.name ? '이름을 입력하세요' : undefined}
          />
          <Textarea
            label="설명"
            placeholder="프로젝트 설명"
            rows={2}
            {...register('description')}
          />
          <Select
            label="색상"
            value={color}
            onChange={(v) => setValue('color', v ?? 'blue')}
            data={COLOR_OPTIONS}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" onClick={closeModal}>취소</Button>
            <Button type="submit">{editingProject ? '수정' : '추가'}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
