import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';

const { VITE_BASE_URL: baseUrl, VITE_API_PATH: apiPath } = import.meta.env;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/products`);
        setProducts(res.data.products);
      } catch (error) {
        alert('取得產品失敗');
      }
    };
    getProducts();
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
    } catch (error) {
      alert('加入購物車失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container pt-5">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: '200px' }}>
                  <img
                    className="img-fluid"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價 {product.origin_price} 元</del>
                  <div className="h5">特價 {product.origin_price}元</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <Link
                      to={`/products/${product.id}`}
                      type="button"
                      className="btn btn-outline-secondary "
                    >
                      查看更多
                    </Link>
                    <button
                      onClick={() => addCartItem(product.id, 1)}
                      type="button"
                      disabled={isLoading}
                      className="btn btn-outline-danger d-flex align-items-center gap-2"
                    >
                      加到購物車
                      {isLoading && (
                        <ReactLoading
                          type={'spin'}
                          color={'#000'}
                          height={'1.5rem'}
                          width={'1.5rem'}
                        />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
