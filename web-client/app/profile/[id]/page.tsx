'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://us-central1-burjcode-profile-dev.cloudfunctions.net/getUserFn?userId=${id}`
        );
        const json = await res.json();

        if (res.ok) {
          setData(json);
        } else {
          console.error('Fetch error:', json.error);
        }
      } catch (err) {
        console.error('Request failed:', err);
      }
    };

    if (id) fetchData();
  }, [id]);

  const themeStyles: any = {
    Classic: 'bg-white border border-gray-200 text-black',
    Modern: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg',
    Elegant: 'bg-gradient-to-br from-purple-200 via-white to-pink-200 text-black border',
  };

  if (!data) return <p className="p-6 text-center">Loading profile...</p>;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className={`w-full max-w-md rounded-xl p-6 text-center transition ${themeStyles[data.theme || 'Classic']}`}>
        {/* Show profile image if available, fallback to icon */}
        {data.profileImageUrl ? (
          <img
            src={data.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 mx-auto rounded-full object-cover mb-3 border"
          />
        ) : (
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3">
            <UserIcon className="w-6 h-6 opacity-70" />
          </div>
        )}

        <h3 className="text-2xl font-bold">
          {data.firstName || 'Your'} {data.lastName || 'Name'}
        </h3>

        <p className="text-sm italic opacity-80 mt-2">
          {data.address || 'Fill out the form to see your profile preview'}
        </p>

        <div className="mt-4 text-sm space-y-1">
          <p><strong>DOB:</strong> {data.dob}</p>
          <p><strong>Phone:</strong> {data.phoneNumber}</p>
          <p><strong>Address:</strong> {data.address}</p>
        </div>
      </div>
    </main>
  );
}
