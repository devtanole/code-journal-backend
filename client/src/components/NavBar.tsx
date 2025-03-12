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
      <header className="purple-background">
        <div className=" container">
          <div className="row">
            <div className="column-full d-flex align-center">
              <h1 className="white-text">Code Journal</h1>
              <Link to="/" className="entries-link white-text">
                <h3>Entries</h3>
              </Link>
              {user ? (
                <button
                  onClick={handleClick}
                  className="entries-link white-text">
                  <h3>Sign Out</h3>
                </button>
              ) : (
                <Link to="/auth/sign-in" className="entries-link white-text">
                  <h3>Sign In</h3>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}
