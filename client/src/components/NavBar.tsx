import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';

export function NavBar() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();
  function handleClick(): void {
    handleSignOut();
    navigate('/');
  }

  return (
    <>
      <header className="bg-purple-700 w-full">
        <nav className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Code Journal</h1>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white hover:underline">
              Entries
            </Link>

            {user ? (
              <button
                onClick={handleClick}
                className="text-purple hover:underline"
                type="button">
                Sign Out
              </button>
            ) : (
              <Link to="/auth/sign-in" className="text-white hover:underline">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>

      <Outlet />
    </>
  );
}
