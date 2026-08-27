import { EmptyRoom } from "@/components/workspace/EmptyRoom";

export default function ContentPage() {
  return (
    <EmptyRoom
      kicker="Command"
      title="Content"
      body="No media library is connected. This room stays empty until real assets are stored."
    />
  );
}
