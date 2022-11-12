import Link from 'next/link';

export default function Logout() {
  return <Link href="/api/auth/logout">Logout</Link>;
}
