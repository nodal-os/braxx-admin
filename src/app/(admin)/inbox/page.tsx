import { EmptyRoom } from "@/components/workspace/EmptyRoom";

export default function InboxPage() {
  return (
    <EmptyRoom
      kicker="Command"
      title="Inbox"
      body="No mail, Slack, or SMS accounts are connected. This room stays empty until a real inbox is wired."
    />
  );
}
