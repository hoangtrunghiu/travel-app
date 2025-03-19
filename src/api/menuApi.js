import axiosClient from './axiosClient';

const menuApi = {
   createMenu: (menu) => {
      return axiosClient.post('/StoredProcedure/execute', {
         procedureName: 'sp_CreateMenu',
         parameters: [
            { name: 'MenuName', value: menu.MenuName },
            { name: 'MenuUrl', value: menu.MenuUrl },
            { name: 'IndexNumber', value: menu.IndexNumber },
            { name: 'ParentId', value: menu.ParentId },
            { name: 'IsHide', value: menu.IsHide },
         ],
      });
   },

   updateMenu: (id, menu) => {
      return axiosClient.post('/StoredProcedure/execute', {
         procedureName: 'sp_UpdateMenu',
         parameters: [
            { name: 'Id', value: Number(id) }, // Ép kiểu INT
            { name: 'MenuName', value: menu.MenuName },
            { name: 'MenuUrl', value: menu.MenuUrl },
            { name: 'IndexNumber', value: Number(menu.IndexNumber) }, // Ép kiểu INT
            { name: 'ParentId', value: menu.ParentId !== null ? Number(menu.ParentId) : null }, // NULL nếu không có giá trị
            { name: 'IsHide', value: menu.IsHide ? 1 : 0 }, // Ép kiểu BIT (0 hoặc 1)
         ],
      });
   },

   deleteMenu: (id) => {
      return axiosClient.post('/StoredProcedure/execute', {
         procedureName: 'sp_DeleteMenu',
         parameters: [{ name: 'Id', value: String(id) }],
      });
   },

   getMenuById: (id) => {
      return axiosClient.post('/StoredProcedure/execute', {
         procedureName: 'sp_GetMenuById',
         parameters: [{ name: 'Id', value: id }],
      });
   },

   getAllMenus: () => {
      return axiosClient.post('/StoredProcedure/execute', {
         procedureName: 'sp_GetAllMenus',
         parameters: [],
      });
   },

   getMenuHierarchy: () => {
      return axiosClient.post('/StoredProcedure/execute', {
         procedureName: 'sp_GetMenuHierarchy',
         parameters: [],
      });
   },

   GetListMenuOfShow: () => {
      return axiosClient.post('/StoredProcedure/execute', {
         procedureName: 'sp_GetListMenuOfShow',
         parameters: [],
      });
   },

   getMenusByParentId: (parentId) => {
      return axiosClient.post('/StoredProcedure/execute', {
         procedureName: 'sp_GetMenusByParentId',
         parameters: [{ name: 'ParentId', value: parentId }],
      });
   },
};

export default menuApi;
