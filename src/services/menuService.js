import menuApi from '@/api/menuApi';

export const addMenu = async (menu) => {
   try {
      const res = await menuApi.createMenu(menu);
      return res.data;
   } catch (error) {
      console.error('Lỗi khi thêm menu:', error);
      throw error;
   }
};

export const updateMenu = async (id, menu) => {
   try {
      const res = await menuApi.updateMenu(id, menu);
      //console.log('Updated menu:', res.data);
      return res.data;
   } catch (error) {
      console.error('Lỗi khi cập nhật menu:', error);
      throw error; // Quan trọng: Ném lỗi để `handleSubmit` biết có lỗi
   }
};

// export const updateMenu = async (id, menu) => {
//    try {
//       const res = await menuApi.updateMenu(id, menu);
//       console.log('Updated menu:', res.data);
//       // Kiểm tra phản hồi từ API
//       if (res.data && res.data.Status === 'success') {
//          return res.data;
//       } else {
//          throw new Error(res.data?.Message || 'Cập nhật thất bại');
//       }
//    } catch (error) {
//       console.error('Lỗi khi cập nhật menu:', error);
//       throw error; // Quan trọng: Ném lỗi để `handleSubmit` biết có lỗi
//    }
// };

export const deleteMenu = async (id) => {
   try {
      await menuApi.deleteMenu(id);
   } catch (error) {
      console.error('Loi khi xóa menu:', error);
      throw error;
   }
};
