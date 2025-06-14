import type { Route } from "../../+types/root";
import {Link} from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GiaSon-PrM" },
    { name: "description", content: "Welcome to Project Manager of Gia Son" },
  ];
}

const HomePage = () => {
  return (
    <>
      <Link to={"/sign-in"}>{"Sign in"}</Link>
      <Link to={"/sign-up"}>{"Sign up"}</Link>
    </>
  );
}

export default HomePage;
