import { Button } from "~/components/ui/button";
import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GiaSon-PrM" },
    { name: "description", content: "Welcome to Project Manager of Gia Son" },
  ];
}

const HomePage = () => {
  return (
    <>Root me</>
  );
}

export default HomePage;
