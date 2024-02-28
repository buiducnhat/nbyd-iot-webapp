import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/projects/_$projectId/')({
  component: ProjectIdIndex,
});

function ProjectIdIndex() {
  const params = Route.useParams();

  return <Navigate to="/projects/$projectId/home" params={params} />;
}
