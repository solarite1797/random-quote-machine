import Spinner from "../../../components/Spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <Spinner className="w-10 h-10" />
    </div>
  );
}
