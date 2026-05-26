import { nanoid } from 'nanoid';
import type { ActivityEntry, Member, Project, Task } from '../types';

const now = new Date();
const d = (daysOffset: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().slice(0, 10);
};

export const demoMembers: Member[] = [
  { id: 'member-1', name: '김민준', color: '#4c6ef5' },
  { id: 'member-2', name: '이서연', color: '#f76707' },
  { id: 'member-3', name: '박지호', color: '#2f9e44' },
];

export const demoProjects: Project[] = [
  {
    id: 'project-1',
    name: '웹 리뉴얼',
    description: '메인 사이트 전면 개편 프로젝트',
    color: 'blue',
    ownerId: 'member-1',
    memberIds: ['member-1', 'member-2', 'member-3'],
    createdAt: now.toISOString(),
  },
  {
    id: 'project-2',
    name: '모바일 앱 v2',
    description: '네이티브 모바일 앱 버전 2 출시',
    color: 'violet',
    ownerId: 'member-2',
    memberIds: ['member-1', 'member-2'],
    createdAt: now.toISOString(),
  },
];

const makeTasks = (): Task[] => {
  const tasks: Omit<Task, 'id'>[] = [
    // project-1 tasks
    { projectId: 'project-1', title: '디자인 시스템 구축', description: '컴포넌트 라이브러리 설계 및 구현', status: 'done', priority: 'high', assigneeId: 'member-1', startDate: d(-20), dueDate: d(-5), tags: ['디자인', 'UI'], dependencies: [], createdAt: d(-25), updatedAt: d(-5), completedAt: d(-5), sortOrder: 1 },
    { projectId: 'project-1', title: '홈페이지 레이아웃', description: '반응형 홈페이지 레이아웃 개발', status: 'done', priority: 'high', assigneeId: 'member-2', startDate: d(-15), dueDate: d(-3), tags: ['프론트엔드'], dependencies: [], createdAt: d(-20), updatedAt: d(-3), completedAt: d(-3), sortOrder: 2 },
    { projectId: 'project-1', title: '검색 기능 구현', description: '전체 텍스트 검색 및 필터링', status: 'in_progress', priority: 'high', assigneeId: 'member-1', startDate: d(-5), dueDate: d(5), tags: ['백엔드', '검색'], dependencies: [], createdAt: d(-10), updatedAt: d(-1), sortOrder: 1 },
    { projectId: 'project-1', title: '사용자 인증 모듈', description: 'OAuth2 소셜 로그인 연동', status: 'in_progress', priority: 'urgent', assigneeId: 'member-3', startDate: d(-3), dueDate: d(7), tags: ['보안', '인증'], dependencies: [], createdAt: d(-8), updatedAt: d(0), sortOrder: 2 },
    { projectId: 'project-1', title: 'SEO 최적화', description: '메타태그, 구조화 데이터 적용', status: 'in_progress', priority: 'medium', assigneeId: 'member-2', startDate: d(-2), dueDate: d(10), tags: ['SEO'], dependencies: [], createdAt: d(-5), updatedAt: d(0), sortOrder: 3 },
    { projectId: 'project-1', title: '성능 최적화', description: 'Core Web Vitals 점수 개선', status: 'todo', priority: 'medium', assigneeId: 'member-1', startDate: d(3), dueDate: d(15), tags: ['성능'], dependencies: [], createdAt: d(0), updatedAt: d(0), sortOrder: 1 },
    { projectId: 'project-1', title: 'E2E 테스트 작성', description: 'Playwright로 핵심 시나리오 테스트', status: 'todo', priority: 'low', assigneeId: 'member-3', startDate: d(10), dueDate: d(20), tags: ['테스트'], dependencies: [], createdAt: d(0), updatedAt: d(0), sortOrder: 2 },
    { projectId: 'project-1', title: '배포 파이프라인 구성', description: 'CI/CD 자동화 설정', status: 'todo', priority: 'high', assigneeId: 'member-2', startDate: d(12), dueDate: d(18), tags: ['DevOps'], dependencies: [], createdAt: d(0), updatedAt: d(0), sortOrder: 3 },
    // project-2 tasks
    { projectId: 'project-2', title: '앱 아키텍처 설계', description: '전체 모듈 구조 및 상태관리 설계', status: 'done', priority: 'urgent', assigneeId: 'member-2', startDate: d(-18), dueDate: d(-8), tags: ['아키텍처'], dependencies: [], createdAt: d(-20), updatedAt: d(-8), completedAt: d(-8), sortOrder: 1 },
    { projectId: 'project-2', title: '로그인 화면 개발', description: '소셜 로그인 포함 인증 UI', status: 'done', priority: 'high', assigneeId: 'member-1', startDate: d(-10), dueDate: d(-2), tags: ['UI', '인증'], dependencies: [], createdAt: d(-12), updatedAt: d(-2), completedAt: d(-2), sortOrder: 2 },
    { projectId: 'project-2', title: '메인 피드 구현', description: '무한 스크롤 콘텐츠 피드', status: 'in_progress', priority: 'high', assigneeId: 'member-2', startDate: d(-4), dueDate: d(8), tags: ['피드', 'UI'], dependencies: [], createdAt: d(-6), updatedAt: d(0), sortOrder: 1 },
    { projectId: 'project-2', title: '푸시 알림', description: 'FCM 기반 푸시 알림 시스템', status: 'todo', priority: 'medium', assigneeId: 'member-1', startDate: d(5), dueDate: d(14), tags: ['알림'], dependencies: [], createdAt: d(0), updatedAt: d(0), sortOrder: 1 },
    { projectId: 'project-2', title: '오프라인 모드', description: 'Service Worker 캐싱 전략', status: 'todo', priority: 'low', assigneeId: 'member-2', startDate: d(12), dueDate: d(25), tags: ['PWA'], dependencies: [], createdAt: d(0), updatedAt: d(0), sortOrder: 2 },
    { projectId: 'project-2', title: '스토어 심사 준비', description: 'App Store / Play Store 심사 서류', status: 'todo', priority: 'urgent', assigneeId: 'member-1', startDate: d(20), dueDate: d(30), tags: ['배포'], dependencies: [], createdAt: d(0), updatedAt: d(0), sortOrder: 3 },
    { projectId: 'project-2', title: 'QA 테스트', description: '단말 호환성 및 회귀 테스트', status: 'todo', priority: 'high', assigneeId: 'member-2', startDate: d(15), dueDate: d(22), tags: ['테스트', 'QA'], dependencies: [], createdAt: d(0), updatedAt: d(0), sortOrder: 4 },
  ];

  return tasks.map((t) => ({ ...t, id: nanoid() }));
};

const makeActivity = (tasks: Task[]): ActivityEntry[] => {
  return tasks.slice(0, 8).map((t, i) => ({
    id: nanoid(),
    type: t.status === 'done' ? 'task_status_changed' : 'task_created',
    taskId: t.id,
    projectId: t.projectId,
    payload:
      t.status === 'done'
        ? { from: 'in_progress', to: 'done', taskTitle: t.title }
        : { taskTitle: t.title },
    createdAt: new Date(now.getTime() - i * 3600 * 1000).toISOString(),
  }));
};

export function generateDemoData() {
  const tasks = makeTasks();
  return {
    members: Object.fromEntries(demoMembers.map((m) => [m.id, m])),
    projects: Object.fromEntries(demoProjects.map((p) => [p.id, p])),
    tasks: Object.fromEntries(tasks.map((t) => [t.id, t])),
    activity: makeActivity(tasks),
  };
}
