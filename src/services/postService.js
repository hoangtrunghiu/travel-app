import postApi from '@/api/postApi';

// Lấy tất cả bài viết
export const getAllPosts = async () => {
   const response = await postApi.getAll();
   return response.data;
};

export const getAllPosts2 = async ({ page = 1, pageSize = 1, categoryId = null, published = null }) => {
   const params = new URLSearchParams({
      page,
      pageSize,
   });

   // Thêm các tham số tùy chọn nếu có
   if (categoryId !== null) {
      params.append('categoryId', categoryId);
   }

   if (published !== null) {
      params.append('published', published);
   }

   const response = await postApi.getAll2(params);
   return {
      data: response.data.items,
      totalCount: response.data.totalCount,
      currentPage: response.data.currentPage,
      pageSize: response.data.pageSize,
   };
};

// Lấy bài viết theo danh mục (bao gồm cả danh mục con)
export const getPostsByCategory = async (categoryId) => {
   const response = await postApi.getByCategoryId(categoryId);
   return response.data;
};

// Lấy bài viết theo ID
export const getPostById = async (postId) => {
   return await postApi.getById(postId);
};

//Tạo bài viết mới

export const createPost = async (postData) => {
   return await postApi.create(postData);
};

//Cập nhật bài viết

export const updatePost = async (id, postData) => {
   return await postApi.update(id, postData);
};

// Xóa bài viết
export const deletePost = async (postId) => {
   await postApi.delete(postId);
};
