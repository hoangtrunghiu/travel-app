import categoryApi from '@/api/categoryApi';

export const addCategory = async (category) => {
   try {
      const res = await categoryApi.create(category);
      return res.data;
   } catch (error) {
      // console.log('Lỗi API:', error.response); // Kiểm tra log
      if (error.response && error.response.data) {
         throw error.response.data; // Trả về đúng object lỗi từ API
      }
      // eslint-disable-next-line no-throw-literal
      throw { message: 'Lỗi kết nối với server' }; // Trả về object lỗi thay vì Error object
   }
};

export const updateCategory = async (id, category) => {
   try {
      const res = await categoryApi.update(id, category);
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
      await categoryApi.delete(id);
   } catch (error) {
      console.error('Lỗi khi xóa category:', error);
      throw error;
   }
};

export const flattenCategories = (categories, level = 0) => {
   let flatList = [];
   categories.forEach((category) => {
      const { children, ...categoryWithoutChildren } = category;

      // Tạo tiền tố dựa theo level
      const prefix = level > 0 ? '¦---'.repeat(level) + ' ' : '';

      flatList.push({
         ...categoryWithoutChildren,
         title: prefix + categoryWithoutChildren.title, // Gắn tiền tố vào title
         level,
         key: `${categoryWithoutChildren.id}-${level}`, // Đảm bảo key là duy nhất
      });

      if (children && children.length > 0) {
         flatList = flatList.concat(flattenCategories(children, level + 1));
      }
   });
   return flatList;
};
