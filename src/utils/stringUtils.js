//tạo url từ tiêu đề

export const generateSlug = (text) => {
   if (!text) return '';

   // Chuyển đổi tiếng Việt có dấu thành không dấu
   let str = text.toLowerCase();

   // Chuyển đổi các ký tự có dấu thành không dấu
   str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

   // Xóa các ký tự đặc biệt
   str = str.replace(/[^\w\s-]/g, '');

   // Thay thế khoảng trắng bằng dấu gạch ngang
   str = str.replace(/\s+/g, '-');

   // Xóa các dấu gạch ngang liên tiếp
   str = str.replace(/-+/g, '-');

   // Xóa dấu gạch ngang ở đầu và cuối
   str = str.replace(/^-+|-+$/g, '');

   return str;
};
