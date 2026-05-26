import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TaskModal } from './components/common/TaskModal';
import { ProjectModal } from './components/common/ProjectModal';
import { DashboardPage } from './pages/DashboardPage';
import { KanbanPage } from './pages/KanbanPage';
import { GanttPage } from './pages/GanttPage';
import { TaskListPage } from './pages/TaskListPage';

export function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <>
      <AppShell
        header={{ height: 64 }}
        navbar={{
          width: 220,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="lg"
        styles={{
          header: {
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #E8E8F0',
          },
          navbar: {
            backgroundColor: '#1A1A2E',
            borderRight: '1px solid #2A2A40',
          },
          main: {
            backgroundColor: '#F8F8FC',
          },
        }}
      >
        <AppShell.Header>
          <Group h="100%" px="md" gap="xs">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
              color="#7800FF"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
              color="#7800FF"
            />
            <Header />
          </Group>
        </AppShell.Header>

        <AppShell.Navbar>
          <Sidebar />
        </AppShell.Navbar>

        <AppShell.Main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/gantt" element={<GanttPage />} />
            <Route path="/list" element={<TaskListPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>

      <TaskModal />
      <ProjectModal />
    </>
  );
}

export default App;
