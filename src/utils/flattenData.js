export const flattenCategoryTour = (data, level = 0) => {
   let flatList = [];
   data.forEach((category) => {
      const { children, ...dataWithoutChildren } = category;

      // Tạo tiền tố dựa theo level
      const prefix = level > 0 ? '¦---'.repeat(level) + ' ' : '';

      flatList.push({
         ...dataWithoutChildren,
         categoryName: prefix + dataWithoutChildren.categoryName, // Gắn tiền tố vào title
         level,
         key: `${dataWithoutChildren.id}-${level}`, // Đảm bảo key là duy nhất
      });

      if (children && children.length > 0) {
         flatList = flatList.concat(flattenCategoryTour(children, level + 1));
      }
   });
   return flatList;
};
