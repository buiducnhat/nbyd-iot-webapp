import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/projects/_$projectId/datastreams')({
  component: ProjectIdDatastreams,
});

function ProjectIdDatastreams() {
  return <div>Datastreams</div>;
}
