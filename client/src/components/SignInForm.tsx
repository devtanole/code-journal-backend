import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, useUser } from './useUser';

type AuthData = {
  user: User;
  token: string;
};

/**
 * Form that signs in a user.
 */
export function SignInForm() {
  const { handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = (await res.json()) as AuthData;
      handleSignIn(user, token);
      navigate('/');
    } catch (err) {
      alert(`Error signing in: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 px-4 bg-white text-black">
      <div className="w-full max-w-md p-6 border border-gray-300 rounded-md shadow-sm">
        <h2 className="text-xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            Username
            <input
              required
              name="username"
              type="text"
              className="mt-1 block w-full border border-gray-400 rounded p-2"
            />
          </label>
          <label className="block mb-3">
            Password
            <input
              required
              name="password"
              type="password"
              className="mt-1 block w-full border border-gray-400 rounded p-2"
            />
          </label>
          <button
            disabled={isLoading}
            className="w-full py-2 rounded bg-purple-800 text-white hover:bg-gray-900 disabled:opacity-50">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          New user?{' '}
          <Link to="/auth/sign-up" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
