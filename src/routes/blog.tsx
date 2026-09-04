import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/blog")({
  component: BlogLayout,
});

function BlogLayout() {
  return (
    <div className="min-h-screen bg-[#EFE8DA]">
      <SiteNav />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
