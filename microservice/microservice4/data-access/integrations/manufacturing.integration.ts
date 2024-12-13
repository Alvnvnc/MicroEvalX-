import { manufacturingAPI } from '.';

export const getAllProductionRequest = async () => {
  try {
    const response = await manufacturingAPI.get('/production_request');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProductionOrder = async () => {
  try {
    const response = await manufacturingAPI.get('/production_order');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductionRequestSumQtyStatusOnProgress = async (
  item_code: string,
) => {
  try {
    const response = await manufacturingAPI.get(`/production_request`);
    const allProdReq = response.data;
    let sumQty = 0;
    allProdReq.forEach((prodReq: any) => {
      if (prodReq.pr_status == 'On Progress' && prodReq.item_id == item_code) {
        sumQty += prodReq.pr_qty;
      }
    });
    return sumQty;
  } catch (error) {
    throw error;
  }
};

export const getProductionOrderSumQtyStatusOnProgress = async (
  item_code: string,
) => {
  try {
    const response = await manufacturingAPI.get(`/production_order`);
    const allProdOrder = response.data;
    let sumQty = 0;
    allProdOrder.forEach((prodOrder: any) => {
      if (
        prodOrder.po_status == 'On Progress' &&
        prodOrder.item_id == item_code
      ) {
        sumQty += prodOrder.po_qty;
      }
    });
    return sumQty;
  } catch (error) {
    throw error;
  }
};

export const getQuantityEndProductUsedInInspection = async () => {
  try {
    const response = await manufacturingAPI.get(`/inspection_product/approved`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProductionRequest = async (
  pr_id: string,
  data_update: any,
) => {
  try {
    const response = await manufacturingAPI.put(
      `/production_request/${pr_id}`,
      data_update,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
