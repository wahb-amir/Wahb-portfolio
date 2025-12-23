// server component (default)
import ProjectClient from "./Project";
import { getLatestProjectsPayload } from "@/lib/projectsService";

type ProjectsPayload<T = unknown> = {
  version: string | number | null;
  data: T | null;
};

export default async function ProjectServer() {
  let payload: ProjectsPayload = {
    version: null,
    data: null,
  };

  try {
    const { payload: svcPayload } = await getLatestProjectsPayload({
      clientVersion: null,
    });

    payload = {
      version: svcPayload.version ?? null,
      data: svcPayload.data ?? null,
    };
  } catch (err) {
    console.warn("ProjectServer: failed to load projects:", err);
  }
  //@ts-ignore
  return <ProjectClient serverPayload={payload} />;
}
