import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="h1-bold text-dark-100_light900">All questions</h1>
      <Link href="/ask-question">
        <Button>Ask-Question</Button>
      </Link>
    </div>
  );
}
