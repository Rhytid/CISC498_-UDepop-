export function getDisplayName(user: {
  firstName: string;
  lastName: string;
  username: string;
} | null) {
  if (!user) {
    return "Unknown user";
  }
  return `${user.firstName} ${user.lastName}`.trim() || user.username;
}

export function formatMessageTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatConversationTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return formatMessageTime(timestamp);
  }
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}
