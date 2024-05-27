import { memo } from "react";
import Header from "@/modules/auth/components/Header";
import 'react-loading-skeleton/dist/skeleton.css'
import MovieList from "../components/MovieList";

const HomePage = () => {
  return (
    <div className="home-container w-full">
      <Header />
      <MovieList />
    </div>
  );
};

export default memo(HomePage);
