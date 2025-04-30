import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface Breadcrumb {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);


  useEffect(() => {
    const paths = pathname?.split("/") || [];
    const breadcrumbs: Breadcrumb[] = paths.slice(1).map((path) => {
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1),
        href: pathname?.slice(0, pathname?.indexOf(path) + path.length) || '',
      } as Breadcrumb;
    });
    if (pathname?.endsWith('/')) {
      breadcrumbs.pop();
    }
    setBreadcrumbs(breadcrumbs);
  }, [pathname]);

  return (
    <div className="breadcrumbs text-xs">
      <ul className="flex gap-2">
        {breadcrumbs.map((breadcrumb, idx) => (
          <li key={idx}>
            {idx === breadcrumbs.length - 1 ? (
              <span className="cursor-default font-semibold">{breadcrumb.label}</span>
            ) : (
              <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}