import { EmptyRoom } from "@/components/workspace";

export default function ExpensesPage() {
  return (
    <EmptyRoom
      kicker="Command"
      title="Expenses"
      body="No expenses are loaded. This room stays empty until real costs are recorded."
    />
  );
}
