import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';

const { VITE_BASE_URL: baseUrl, VITE_API_PATH: apiPath } = import.meta.env;

const ProductModalComponent = ({
  modalMode,
  tempProduct,
  isOpen,
  setIsOpen,
  getProducts,
}) => {
  const [modalData, setModalData] = useState(tempProduct); // 外層的 tempProduct 有更改的時候，更新 modalData 為最新商品資料
  useEffect(() => {
    setModalData({
      ...tempProduct,
    });
  }, [tempProduct]);

  // 用於儲存 modal 實體
  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false,
    });
  }, []);
  // 監聽 isOpen 值狀態，如果為 true 則打開 modal
  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(productModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);

  // 關閉 modal 方法
  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    setIsOpen(false);
  };

  // 監聽表單中各項值得狀態，用於及時寫入修改的的值到 modalData 並渲染到畫面上
  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target;

    // 用於判斷是否屬於 content 欄位更新
    const contentFields = [
      'material_contents',
      'notes',
      'origin',
      'shelf_life',
    ];
    const isContentField = contentFields.includes(name);

    // 先定義 inputValue
    const inputValue = type === 'checkbox' ? checked : value;

    // 使用回呼函式保證可取得最新狀態（避免非同步造成的舊資料）
    setModalData((prevProduct) => {
      // 如果是 content 中的欄位，更新 content
      if (isContentField) {
        return {
          ...prevProduct,
          content: {
            ...prevProduct.content,
            [name]: inputValue,
          },
        };
      }

      // 否則直接更新最外層
      return {
        ...prevProduct,
        [name]: inputValue,
      };
    });
  };

  // 控制與寫入商品圖片資料
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...modalData.imagesUrl];

    newImages[index] = value;

    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  // 新增商品附圖資料
  const handleAddImage = () => {
    const newImages = [...modalData.imagesUrl, ''];
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  // 刪除商品品附圖資料
  const handleRemoveImage = () => {
    const newImages = [...modalData.imagesUrl];
    newImages.pop();

    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  //新增商品資料方法
  const createProduct = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/${apiPath}/admin/product`, {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        },
      });
      alert('新增產品成功!');
      handleCloseProductModal();
    } catch (error) {
      console.error(error);
      alert(`新增產品失敗! ${error.response.data.message}`);
    }
  };

  //編輯現有商品資料方法
  const updateProduct = async () => {
    try {
      await axios.put(
        `${baseUrl}/v2/api/${apiPath}/admin/product/${modalData.id}`,
        {
          data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0,
          },
        }
      );
      alert('修改產品成功!');
      handleCloseProductModal();
    } catch (error) {
      console.error(error);
      alert(`編輯產品失敗 ${error.response.data.message}`);
    }
  };

  // 控制商品資料 - 編輯或新增
  const handleUpdateProduct = async () => {
    const apiCall = modalMode === 'create' ? createProduct : updateProduct;
    try {
      await apiCall();
      getProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // 上傳圖片功能
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file-to-upload', file);

    try {
      const res = await axios.post(
        `${baseUrl}/v2/api/${apiPath}/admin/upload`,
        formData
      );

      const uploadedImageUrl = res.data.imageUrl;
      setModalData({
        ...modalData,
        imageUrl: uploadedImageUrl,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        id="productModal"
        ref={productModalRef}
        className="modal"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">
                {modalMode === 'create' ? '新增產品' : '編輯產品'}
              </h5>
              <button
                onClick={handleCloseProductModal}
                type="button"
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label">
                      圖片上傳
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        value={modalData.imageUrl}
                        onChange={handleModalInputChange}
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    <img
                      src={modalData.imageUrl}
                      alt={modalData.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {modalData.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => {
                            handleImageChange(e, index);
                          }}
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {modalData.imagesUrl.length < 5 &&
                        modalData.imagesUrl[modalData.imagesUrl.length - 1] !==
                          '' && (
                          <button
                            onClick={handleAddImage}
                            className="btn btn-outline-primary btn-sm w-100"
                          >
                            新增圖片
                          </button>
                        )}
                      {modalData.imagesUrl.length > 1 && (
                        <button
                          onClick={handleRemoveImage}
                          className="btn btn-outline-danger btn-sm w-100"
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={modalData.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={modalData.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={modalData.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={modalData.origin_price}
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        min="0"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={modalData.price}
                        onChange={handleModalInputChange}
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={modalData.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="material_contents" className="form-label">
                      商品內容物
                    </label>
                    <textarea
                      value={modalData.content.material_contents}
                      onChange={handleModalInputChange}
                      name="material_contents"
                      id="material_contents"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入商品內容物文字說明"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      注意事項
                    </label>
                    <input
                      value={modalData.content.notes}
                      onChange={handleModalInputChange}
                      name="notes"
                      id="notes"
                      type="text"
                      className="form-control"
                      placeholder="請輸入注意事項"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="origin" className="form-label">
                      商品產地
                    </label>
                    <input
                      value={modalData.content.origin}
                      onChange={handleModalInputChange}
                      name="origin"
                      id="origin"
                      type="text"
                      className="form-control"
                      placeholder="請輸入產定國家名稱"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="shelf_life" className="form-label">
                      有效期限
                    </label>
                    <input
                      value={modalData.content.shelf_life}
                      onChange={handleModalInputChange}
                      name="shelf_life"
                      id="shelf_life"
                      type="text"
                      className="form-control"
                      placeholder="請設定商品有效期限"
                    />
                  </div>
                  <div className="form-check">
                    <input
                      checked={modalData.is_enabled}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      啟用商品
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                onClick={handleCloseProductModal}
                type="button"
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleUpdateProduct}
                type="button"
                className="btn btn-primary"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModalComponent;
