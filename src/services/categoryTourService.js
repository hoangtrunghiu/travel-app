import categoryTourApi from '@/api/categoryTourApi';

export const getAllCategoryTours = async () => {
   const response = await categoryTourApi.getAll();
   return response.data;
};
export const getCategoryTourById = async (postId) => {
   const response = await categoryTourApi.getById(postId);
   return response.data;
};
export const addCategory = async (category) => {
   try {
      const res = await categoryTourApi.create(category);
      return res.data;
   } catch (error) {
      // console.log('Lỗi API:', error.response); // Kiểm tra log
      if (error.response && error.response.data) {
         throw error.response.data; // Trả về đúng object lỗi từ API
      }
      // eslint-disable-next-line no-throw-literal
      throw { message: 'Lỗi kết nối với server' }; // Trả về object lỗi
   }
};

export const updateCategory = async (id, category) => {
   try {
      const res = await categoryTourApi.update(id, category);
      return res.data;
   } catch (error) {
      console.log('Lỗi API updateCategory:', error.response); // Kiểm tra log

      if (error.response && error.response.data) {
         throw error.response.data;
      }
      // eslint-disable-next-line no-throw-literal
      throw { message: 'Lỗi kết nối với server' };
   }
};

export const deleteCategory = async (id) => {
   try {
      await categoryTourApi.delete(id);
   } catch (error) {
      console.error('Lỗi khi xóa category:', error);
      throw error;
   }
};
