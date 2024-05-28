import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/d/projects/$projectId/_layout/')({
  component: ProjectIdIndex,
});

function ProjectIdIndex() {
  const params = Route.useParams();

  return <Navigate to="/d/projects/$projectId/gateways" params={params} />;
}
