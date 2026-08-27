import { EmptyRoom } from "@/components/workspace";

export default function NewCampaignPage() {
  return (
    <EmptyRoom
      kicker="Campaign"
      title="Add campaign"
      body="The builder is not connected. Creating a campaign would only write local demo state, so the form is gone."
    />
  );
}
