import axiosClient from '@/api/axiosClient';

//Lấy danh sách ảnh theo loại đối tượng và ID đối tượng
export const getImagesByEntity = async (entityType, entityId) => {
   try {
      const response = await axiosClient.get(`/library-images/${entityType}/${entityId}`);
      return response.data;
   } catch (error) {
      console.error('Lỗi khi lấy danh sách ảnh:', error);
      return [];
   }
};

// Thêm một ảnh vào một đối tượng
export const addImageToEntity = async (entityType, entityId, imageUrl) => {
   try {
      const response = await axiosClient.post(`/library-images/${entityType}/${entityId}/add-image`, { imageUrl });
      return response.data;
   } catch (error) {
      console.error('Lỗi khi thêm ảnh:', error);
      throw error;
   }
};

//Xóa một ảnh theo ID
export const deleteImage = async (imageId) => {
   try {
      const response = await axiosClient.delete(`/library-images/delete/${imageId}`);
      return response.data;
   } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error);
      throw error;
   }
};

//Xóa nhiều ảnh cùng lúc
export const deleteMultipleImages = async (imageIds) => {
   try {
      // Thoát hàm nếu không có ảnh nào để xóa
      if (!imageIds || imageIds.length === 0) {
         return { message: 'Không có ảnh nào để xóa' };
      }
      const response = await axiosClient.delete('/library-images/delete-multiple', {
         data: imageIds,
      });
      return response.data;
   } catch (error) {
      console.error('Lỗi khi xóa danh sách ảnh:', error);
      throw error;
   }
};

//Thêm nhiều ảnh cùng lúc
export const addMultipleImages = async (entityType, entityId, imageUrls) => {
   try {
      // Thoát hàm nếu không có ảnh nào để thêm
      if (!imageUrls || imageUrls.length === 0) {
         return [];
      }

      const urls = imageUrls.map((url) => ({ imageUrl: url }));
      const response = await axiosClient.post(`/library-images/${entityType}/${entityId}/add-multiple`, urls);
      return response.data;
   } catch (error) {
      console.error('Lỗi khi thêm danh sách ảnh:', error);
      throw error;
   }
};

/**
 * Cập nhật hình ảnh đối tượng, chỉ cập nhật những gì thay đổi
 * - Xóa ảnh không còn trong danh sách gửi lên
 * - Thêm ảnh không có trong danh sách gốc
 * - Giữ nguyên hình ảnh không thay đổi
 */
export const updateEntityImages = async (entityType, entityId, newImageUrls = []) => {
   try {
      // Lấy danh sách ảnh hiện có từ database
      const existingImages = await getImagesByEntity(entityType, entityId);
      const existingUrls = existingImages.map((img) => img.imageUrl);

      // Thoát hàm nếu so sánh không thay đổi gì
      if (arraysEqual(existingUrls, newImageUrls)) {
         return existingImages;
      }

      // Tìm ảnh để xóa (xóa ảnh không còn tồn tại trong danh sách)
      const imagesToDelete = existingImages.filter((img) => !newImageUrls.includes(img.imageUrl));

      // Tìm ảnh để thêm (Thêm ảnh mới chưa có trong danh sách)
      const urlsToAdd = newImageUrls.filter((url) => !existingUrls.includes(url));

      // Thực hiện xóa nếu có
      if (imagesToDelete.length > 0) {
         const imageIdsToDelete = imagesToDelete.map((img) => img.id);
         await deleteMultipleImages(imageIdsToDelete);
      }

      // Thêm ảnh nếu có
      if (urlsToAdd.length > 0) {
         await addMultipleImages(entityType, entityId, urlsToAdd);
      }

      // Nếu có thay đổi, lấy lại danh sách ảnh mới
      if (imagesToDelete.length > 0 || urlsToAdd.length > 0) {
         return await getImagesByEntity(entityType, entityId);
      }

      // Nếu không thì trả về danh sách hiện có
      return existingImages;
   } catch (error) {
      console.error('Lỗi cập nhật hình ảnh:', error);
      throw error;
   }
};

//Xóa tất cả ảnh của một đối tượng
export const deleteAllEntityImages = async (entityType, entityId) => {
   try {
      // Kiểm tra xem có ảnh nào không
      const existingImages = await getImagesByEntity(entityType, entityId);

      // Nếu không có
      if (!existingImages || existingImages.length === 0) {
         return { message: 'No images to delete' };
      }

      // Nếu có gọi api xóa hết
      const response = await axiosClient.delete(`/library-images/${entityType}/${entityId}/delete-all`);
      return response.data;
   } catch (error) {
      console.error('Lỗi khi xóa danh sách ảnh:', error);
      return { message: 'Xóa danh sách ảnh thất bại' };
   }
};

//Kiểm tra xem hai mảng có giống nhau không
function arraysEqual(a, b) {
   if (a === b) return true;
   if (a == null || b == null) return false;
   if (a.length !== b.length) return false;

   // Sort both arrays to ensure consistent comparison
   const sortedA = [...a].sort();
   const sortedB = [...b].sort();

   for (let i = 0; i < sortedA.length; i++) {
      if (sortedA[i] !== sortedB[i]) return false;
   }
   return true;
}
