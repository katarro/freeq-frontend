import { FC } from "react";

interface LoaderProps {
  loading?: boolean;
}

export const Loader: FC<LoaderProps> = ({ loading = true }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <span className="text-lg font-medium text-white">Cargando...</span>
      </div>
    </div>
  );
};
