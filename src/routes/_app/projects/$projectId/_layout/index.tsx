import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/projects/$projectId/_layout/')({
  component: ProjectIdIndex,
});

function ProjectIdIndex() {
  const params = Route.useParams();

  return <Navigate to="/projects/$projectId/gateways" params={params} />;
}
