import { usePaginatedQuery } from "convex/react";
import React from "react";
import { api } from "../../convex/_generated/api";

export function MassUsers() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.users.listAll,
    {},
    { initialNumItems: 5 },
  );
  return (
    <div>
      {results?.map(({ _id, username, pfp }) => (
        <div key={_id}>{username}</div>
      ))}
      <button onClick={() => loadMore(5)} disabled={status !== "CanLoadMore"}>
        Load More
      </button>
    </div>
  );
}
