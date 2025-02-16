import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { useParams } from 'react-router-dom';

const { VITE_BASE_URL: baseUrl, VITE_API_PATH: apiPath } = import.meta.env;

const ProductDetailPage = () => {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);

  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { id: product_id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      setIsScreenLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/v2/api/${apiPath}/product/${product_id}`
        );
        setProduct(res.data.product);
      } catch (error) {
        alert('取得產品失敗');
      } finally {
        setIsScreenLoading(false);
      }
    };
    getProduct();
  }, []);

  const addCartItem = async (product_id, qty) => {
    setIsScreenLoading(true);
    try {
      await axios.post(`${baseUrl}/v2/api/${apiPath}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
    } catch (error) {
      alert('加入購物車失敗');
      console.log(error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-6">
            <img
              className="img-fluid"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center gap-2">
              <h2>{product.title}</h2>
              <span className="badge text-bg-success">{product.category}</span>
            </div>
            <p className="mb-3">{product.description}</p>
            {/* <p className="mb-3">{product.content}</p> */}
            <h5 className="mb-3">NT$ {product.price}</h5>
            <div className="input-group align-items-center w-75">
              <select
                value={qtySelect}
                onChange={(e) => setQtySelect(e.target.value)}
                id="qtySelect"
                className="form-select"
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => addCartItem(product_id, qtySelect)}
                disabled={isLoading}
              >
                加入購物車
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
          </div>
        </div>
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

export default ProductDetailPage;
