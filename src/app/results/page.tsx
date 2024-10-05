"use client";

import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { useSearchParams } from "next/navigation";

type Props = {};

const ResultsPage = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  if (search === null) return;
  const { data: searchResults, isLoading, isError } = useSearchQuery(search);

  return (
    <div className="p-8">
      <h2 className="dark:text-white text-2xl font-semibold">
        Search Results for "{search}"
      </h2>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error occurred while fetching search results.</p>}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.tasks && searchResults.tasks?.length > 0 && (
              <h2 className="dark:text-white pb-2">Tasks</h2>
            )}
            {searchResults.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {searchResults.projects && searchResults.projects?.length > 0 && (
              <h2 className="dark:text-white pb-2">Projects</h2>
            )}
            {searchResults.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {searchResults.users && searchResults.users?.length > 0 && (
              <h2 className="dark:text-white pb-2">Users</h2>
            )}
            {searchResults.users?.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
