import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">Symbol not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          That GD&T page is not in this reference set yet.
        </p>
        <LinkButton href="/" className="mt-6">
          Back to reference
        </LinkButton>
      </div>
    </main>
  );
}
