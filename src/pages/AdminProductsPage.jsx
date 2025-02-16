import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { VITE_BASE_URL: baseUrl, VITE_API_PATH: apiPath } = import.meta.env;

import PaginationComponent from '../components/PaginationComponent';
import ProductModalComponent from '../components/ProductModalComponent';
import DeleteProductModalComponent from '../components/DeleteProductModalComponent';

// 產品資料初始狀態
const defaultModalState = {
  imageUrl: '',
  title: '',
  category: '',
  unit: '',
  origin_price: '',
  price: '',
  description: '',
  content: {
    material_contents: '',
    notes: '',
    origin: '',
    shelf_life: '',
  },
  is_enabled: 0,
  imagesUrl: [''],
};

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const checkUserLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
    } catch (error) {
      alert('請先登入');
      navigate('/admin');
      console.error(error);
    }
  };
  // 判斷目前是否已是登入狀態，取出在 cookie 中的 token
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;
    checkUserLogin();
  }, []);

  // 取得產品資料
  const [products, setProducts] = useState([]); // 預設產品資料
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${baseUrl}/v2/api/${apiPath}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  const [tempProduct, setTempProduct] = useState(defaultModalState); // 用於綁定 modal 狀態
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);

  // 開啟 modal 方法
  // mode 參數傳入開啟 model 的狀態，create / edit
  // product 參數傳入單項商品的資料
  const [modalMode, setModalMode] = useState(null);
  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case 'create':
        setTempProduct(defaultModalState);
        break;
      case 'edit':
        setTempProduct(product);
        break;
      default:
        break;
    }
    setIsProductModalOpen(true); // 傳入狀態給子原件商品 modal，透過傳入狀態打開 modal
  };

  const handleOpenDelProductModal = (product) => {
    setTempProduct(product); // 將該項的商品資料寫入
    setIsDeleteProductModalOpen(true); // 傳入狀態給子原件商品 modal，透過傳入狀態打開 modal
  };

  // 控制分頁元件
  const [pageInfo, setPageInfo] = useState({});
  const handelPageChange = (page) => {
    getProducts(page);
  };

  return (
    <>
      <div className="container py-5">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleOpenProductModal('create');
                }}
              >
                建立新的產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span className="text-danger">未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() => {
                            handleOpenProductModal('edit', product);
                          }}
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleOpenDelProductModal(product)}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <PaginationComponent
        pageInfo={pageInfo}
        handelPageChange={handelPageChange}
      />

      {/* 新增與編輯 modal */}
      <ProductModalComponent
        modalMode={modalMode}
        tempProduct={tempProduct}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        getProducts={getProducts}
      />
      {/* 刪除 modal */}
      <DeleteProductModalComponent
        tempProduct={tempProduct}
        getProducts={getProducts}
        isOpen={isDeleteProductModalOpen}
        setIsOpen={setIsDeleteProductModalOpen}
      />
    </>
  );
};

export default AdminProductsPage;
