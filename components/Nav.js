import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav() {
  const router = useRouter();
  
  const navStyle = {
    display: 'flex',
    gap: '15px',
    padding: '15px 20px',
    background: '#333',
    marginBottom: '20px',
    borderRadius: '8px',
    flexWrap: 'wrap',
  };
  
  const linkStyle = (active) => ({
    color: active ? '#fff' : '#aaa',
    textDecoration: 'none',
    fontWeight: active ? 'bold' : 'normal',
    padding: '8px 16px',
    borderRadius: '4px',
    background: active ? '#555' : 'transparent',
    fontSize: '14px',
  });

  return (
    <nav style={navStyle}>
      <Link href="/" style={linkStyle(router.pathname === '/')}>
        🍽️ Weekly Plan
      </Link>
      <Link href="/cookbook" style={linkStyle(router.pathname === '/cookbook')}>
        📖 Cookbook
      </Link>
      <Link href="/grocery" style={linkStyle(router.pathname === '/grocery')}>
        🛒 Grocery List
      </Link>
    </nav>
  );
}
