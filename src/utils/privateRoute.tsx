import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { IToken } from './types';
import SimpleBackdrop from '../components/global/LoadingBackdrop';
import { StorageService } from '../services/StorageService';

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<IToken | null>(null);
  const router = useRouter();

  const isCentricRoute = useMemo(
    () => router.pathname.startsWith('/centric'),
    [router.pathname]
  );

  useEffect(() => {
    if (!isCentricRoute) {
      const storedToken = StorageService.readLocalStorage<IToken>('user');

      if (storedToken && storedToken.accessToken) {
        setToken(storedToken);
      } else {
        router.replace('/centric');
      }
    }
  }, [isCentricRoute, router]);

  return <>{!token && !isCentricRoute ? <SimpleBackdrop /> : children}</>;
}
