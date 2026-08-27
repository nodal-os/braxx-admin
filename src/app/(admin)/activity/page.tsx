import { EmptyRoom } from "@/components/workspace/EmptyRoom";

export default function ActivityPage() {
  return (
    <EmptyRoom
      kicker="Command"
      title="Activity"
      body="No activity stream is connected. This room stays empty until the OS starts writing real events."
    />
  );
}
