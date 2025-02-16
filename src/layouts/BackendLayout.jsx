import { Outlet, NavLink } from 'react-router-dom';

const routes = [{ path: '/', name: '回到首頁' }];

const BackendLayout = () => {
  return (
    <>
      <nav
        className="navbar bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container">
          <ul className="navbar-nav flex-row gap-5 fs-5">
            {routes.map((route) => {
              return (
                <li className="nav-item" key={route.path}>
                  <NavLink
                    className="nav-link"
                    aria-current="page"
                    to={route.path}
                  >
                    {route.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default BackendLayout;
