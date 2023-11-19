import { Spinner } from "@material-tailwind/react";

const LoadingComponent = () => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="flex justify-center items-center">
        <Spinner className="h-10 w-10" />
      </div>
      <h1 className="font-bold text-2xl">LOADING...</h1>
    </div>
  );
};

export default LoadingComponent;
