import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';

const { VITE_BASE_URL: baseUrl, VITE_API_PATH: apiPath } = import.meta.env;

const CartPage = () => {
  const [cart, setCart] = useState({});
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const getCart = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/cart`);
      setCart(res.data.data);
    } catch (error) {
      alert('取得購物車失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const addCartItem = async (product_id, qty) => {
    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}/v2/api/${apiPath}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      await getCart();
    } catch (error) {
      alert('加入購物車失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCart = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${baseUrl}/v2/api/${apiPath}/carts`);
      await getCart();
    } catch (error) {
      alert('清空購物車失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  const removeCartItem = async (cartItem_id) => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${baseUrl}/v2/api/${apiPath}/cart/${cartItem_id}`);
      await getCart();
    } catch (error) {
      alert('清空購物車品項失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  const upDataCartItem = async (cartItem_id, product_id, qty) => {
    setIsScreenLoading(true);
    try {
      await axios.put(`${baseUrl}/v2/api/${apiPath}/cart/${cartItem_id}`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      await getCart();
    } catch (error) {
      alert('更新購物車品項失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    const { message, ...user } = data;
    const userInfo = {
      data: {
        user,
        message,
      },
    };
    checkout(userInfo);
  });

  const checkout = async (data) => {
    setIsScreenLoading(true);
    try {
      await axios.post(`${baseUrl}/v2/api/${apiPath}/order`, data);
      await getCart();
      alert('結帳成功');
      reset();
    } catch (error) {
      alert('結帳失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <>
      <div className="container pt-5">
        {cart.carts?.length > 0 && (
          <div>
            <div className="text-end py-3">
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={() => removeCart()}
              >
                清空購物車
              </button>
            </div>

            <table className="table align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th style={{ width: '150px' }}>數量/單位</th>
                  <th className="text-end">單價</th>
                </tr>
              </thead>

              <tbody>
                {cart.carts?.map((cartItem) => {
                  return (
                    <tr key={cartItem.id}>
                      <td>
                        <button
                          onClick={() => removeCartItem(cartItem.id)}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          x
                        </button>
                      </td>
                      <td>{cartItem.product.title}</td>
                      <td style={{ width: '150px' }}>
                        <div className="d-flex align-items-center">
                          <div className="btn-group me-2" role="group">
                            <button
                              onClick={() =>
                                upDataCartItem(
                                  cartItem.id,
                                  cartItem.product.id,
                                  cartItem.qty - 1
                                )
                              }
                              disabled={cartItem.qty === 1}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                            >
                              -
                            </button>
                            <span
                              className="btn border border-dark"
                              style={{ width: '50px', cursor: 'auto' }}
                            >
                              {cartItem.qty}
                            </span>
                            <button
                              onClick={() =>
                                upDataCartItem(
                                  cartItem.id,
                                  cartItem.product.id,
                                  cartItem.qty + 1
                                )
                              }
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                            >
                              +
                            </button>
                          </div>
                          <span className="input-group-text bg-transparent border-0">
                            {cartItem.product.unit}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">{cartItem.total}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">
                    總計：
                  </td>
                  <td className="text-end" style={{ width: '130px' }}>
                    {cart.total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email 欄位必填',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email 格式錯誤',
                  },
                })}
                id="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="請輸入 Email"
              />
              {errors.email && (
                <p className="text-danger my-2">{errors.email?.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                {...register('name', {
                  required: '收件人姓名 欄位必填',
                })}
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="請輸入姓名"
              />

              {errors.name && (
                <p className="text-danger my-2">{errors.name?.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                {...register('tel', {
                  required: '電話 欄位必填',
                  pattern: {
                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                    message: '電話 格式錯誤',
                  },
                })}
                id="tel"
                type="tel"
                className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
                placeholder="請輸入電話"
              />

              {errors.tel && (
                <p className="text-danger my-2">{errors.tel?.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                {...register('address', {
                  required: '地址 欄位必填',
                })}
                id="address"
                type="text"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                placeholder="請輸入地址"
              />

              {errors.tel && (
                <p className="text-danger my-2">{errors.address?.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                {...register('message')}
                id="message"
                className="form-control"
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-danger"
                disabled={cart.total === 0}
              >
                送出訂單
              </button>
            </div>
          </form>
        </div>
        {isScreenLoading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(255,255,255,0.3)',
              zIndex: 9999,
            }}
          >
            <ReactLoading
              type="spin"
              color="black"
              width="4rem"
              height="4rem"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
