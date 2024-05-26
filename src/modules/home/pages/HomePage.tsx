import { memo } from "react";
import Header from "@/modules/auth/components/Header";
import 'react-loading-skeleton/dist/skeleton.css'

const HomePage = () => {
  return (
    <div className="home-container w-full">
      <Header />
    </div>
  );
};

export default memo(HomePage);
