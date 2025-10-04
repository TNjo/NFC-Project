import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
const params = useParams();
const [searchParams] = useSearchParams();

  useEffect(() => {
    // Always redirect to login for home page
    navigate('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
