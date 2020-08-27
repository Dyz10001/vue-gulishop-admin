import request from "@/utils/request";

//const api_name = '/admin/order'

export default {
  /*
  获取品牌列表 GET /admin/product/baseTrademark/{page}/{limit}
  */
  getPageList(page, limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`);
  },

  /**
   * 删除品牌
   * DELETE /admin/product/baseTrademark/remove/{id}
   * @id 商品id
   */
  delete(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`);
  },

  // POST /admin/product/baseTrademark/save    新增BaseTrademark
  // PUT /admin/product/baseTrademark/update   修改BaseTrademar
  addOrUpdate(trademark) {
    if (trademark.id) {
      return request.put("/admin/product/baseTrademark/update", trademark);
    } else {
      return request.post("/admin/product/baseTrademark/save", trademark);
    }
  }
};
