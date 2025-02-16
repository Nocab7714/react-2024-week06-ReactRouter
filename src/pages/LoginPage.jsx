import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
const { VITE_BASE_URL: baseUrl } = import.meta.env;

const LoginPage = () => {
  //登入資訊
  const [account, setAccount] = useState({
    username: '',
    password: '',
  });
  // 檢查登入狀態
  const handleInputChange = (event) => {
    const { value, name } = event.target; // 將點擊後觸發的 event 事件的 value 和 name 解構出來
    setAccount({
      ...account,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, account);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`; // 登入成功後將 token 於儲存 cookie
      axios.defaults.headers.common['Authorization'] = token; // 並透過 axios 方法將 token 存在 headers
      alert('登入成功');
      navigate('admin-products');
    } catch (error) {
      console.error(error);
      alert('登入失敗');
    }
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">後台登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="username"
              name="username"
              placeholder="name@example.com"
              value={account.username}
              onChange={handleInputChange}
            />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              value={account.password}
              onChange={handleInputChange}
            />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    </>
  );
};

export default LoginPage;
