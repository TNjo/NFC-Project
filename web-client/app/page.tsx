'use client';

import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserIcon, CrownIcon, SparklesIcon } from 'lucide-react';

const firebaseConfig = {
    apiKey: "AIzaSyAnZJbk6hCAHzGbw3qDZOsG0SlHZB99igA",
    authDomain: "burjcode-profile-dev.firebaseapp.com",
    projectId: "burjcode-profile-dev",
    storageBucket: "burjcode-profile-dev.firebasestorage.app",
    messagingSenderId: "497988055501",
    appId: "1:497988055501:web:aad698c976ae37f920d484",
    measurementId: "G-52Q6NSQPGL"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default function Home() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    phoneNumber: '',
    address: ''
  });
  const [theme, setTheme] = useState('Modern');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nfcUrl, setNfcUrl] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    let imageUrl = '';
    if (image) {
      const storageRef = ref(storage, `profile_images/${Date.now()}-${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    const res = await fetch("https://us-central1-burjcode-profile-dev.cloudfunctions.net/addUserFn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, theme, profileImageUrl: imageUrl })
    });

    const data = await res.json();
    const url = `${window.location.origin}/profile/${data.userId}`;
    setNfcUrl(url);
  };

  const themeStyles: any = {
    Classic: "bg-white border border-gray-200 text-black",
    Modern: "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl",
    Elegant: "bg-gradient-to-br from-purple-200 via-white to-pink-200 border text-black"
  };

  const Icon = {
    Classic: UserIcon,
    Modern: SparklesIcon,
    Elegant: CrownIcon
  };

  return (
    <main className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Profile Creation</h1>
        <p className="text-gray-500">Enter your details and see your profile card update in real-time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Form Column */}
        <div className="bg-white rounded-lg p-6 shadow space-y-4 border">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <input type="text" name="firstName" placeholder="Enter your first name" onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
          <input type="text" name="lastName" placeholder="Enter your last name" onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
          <input type="date" name="dob" onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
          <input type="tel" name="phoneNumber" placeholder="(123) 456-7890" onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />
          <textarea name="address" placeholder="Enter your address" onChange={handleChange}
            className="w-full border px-4 py-2 rounded" />

          <input type="file" accept="image/*" onChange={handleImageChange}
            className="w-full border px-4 py-2 rounded" />

          <button onClick={handleSubmit}
            className="w-full mt-4 bg-black text-white font-semibold py-2 rounded hover:bg-gray-800">
            Save Profile
          </button>

          {nfcUrl && (
            <div className="pt-4">
              <p className="text-sm text-gray-600">NFC Profile URL:</p>
              <code className="text-blue-600 text-sm">{nfcUrl}</code>
            </div>
          )}
        </div>

        {/* Right Preview Column */}
        <div className="bg-white rounded-lg p-6 shadow space-y-4 border">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="flex gap-2">
            {['Classic', 'Modern', 'Elegant'].map((t) => {
              const ThemeIcon = Icon[t as keyof typeof Icon];
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex items-center gap-1 px-3 py-1 rounded border text-sm transition ${
                    theme === t ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  <ThemeIcon className="w-4 h-4" />
                  {t}
                </button>
              );
            })}
          </div>

          <div className={`rounded-xl p-6 text-center transition ${themeStyles[theme]}`}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-16 h-16 mx-auto rounded-full object-cover mb-2 border"
              />
            ) : (
              <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2">
                <UserIcon className="w-6 h-6 opacity-70" />
              </div>
            )}
            <h3 className="text-xl font-bold">{form.firstName || 'Your'} {form.lastName || 'Name'}</h3>
            <p className="text-sm italic opacity-80 mt-2">{form.address ? form.address : 'Fill out the form to see your profile preview'}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
