"use client"; // needed for Next.js App Router

import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";

export default function UsersPage() {
  const users = useQuery(api.users.listAll);

  if (users === undefined) {
    return <p>Loading users...</p>;
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <h1>All Users</h1>

      {users.length === 0 && <p>No users yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((user) => (
          <li
            key={user._id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username ?? "avatar"}
                width={48}
                height={48}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#ddd",
                }}
              />
            )}

            <div>
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              {user.username && <div>@{user.username}</div>}
              {user.location && <small>{user.location}</small>}
              {user.bio && <p style={{ margin: "4px 0 0" }}>{user.bio}</p>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
