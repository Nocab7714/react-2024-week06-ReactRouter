import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 3000);
  }, []);

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center">404 找不到頁面</h1>
      </div>
    </>
  );
};

export default NotFoundPage;
