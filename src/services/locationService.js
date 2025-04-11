import locationApi from '@/api/locationApi';

//Crud operations for destination
export const getAllDestinations = async () => {
   try {
      const res = await locationApi.getAllDestinations();
      return res.data;
   } catch (error) {
      console.error('Lỗi khi lấy danh sách Destination:', error);
      throw error;
   }
};
export const getDestinationById = async (id) => {
   try {
      const res = await locationApi.getByIdDestinations(id);
      return res.data;
   } catch (error) {
      console.error('Lỗi khi lấy thông tin Destination:', error);
      throw error;
   }
};
export const addDestination = async (destination) => {
   try {
      const res = await locationApi.createDestinations(destination);
      return res.data;
   } catch (error) {
      if (error.response && error.response.data) {
         throw error.response.data;
      }
      // eslint-disable-next-line no-throw-literal
      throw { message: 'Lỗi kết nối với server' };
   }
};

export const updateDestination = async (id, destination) => {
   try {
      const res = await locationApi.updateDestinations(id, destination);
      return res.data;
   } catch (error) {
      console.log('Lỗi API update destination:', error.response);

      if (error.response && error.response.data) {
         throw error.response.data;
      }
      // eslint-disable-next-line no-throw-literal
      throw { message: 'Lỗi kết nối với server' };
   }
};

export const deleteDestination = async (id) => {
   try {
      await locationApi.deleteDestinations(id);
   } catch (error) {
      console.error('Lỗi khi xóa Destination:', error);
      throw error;
   }
};
//Phân cấp danh sách Destination
export const flattenDestinations = (destinations, level = 0) => {
   let flatList = [];
   destinations.forEach((destination) => {
      const { children, ...DestinationWithoutChildren } = destination;

      // Tạo tiền tố dựa theo level
      const prefix = level > 0 ? '¦---'.repeat(level) + ' ' : '';

      flatList.push({
         ...DestinationWithoutChildren,
         nameFlat: prefix + DestinationWithoutChildren.name, // Gắn tiền tố vào title
         level,
         key: `${DestinationWithoutChildren.id}-${level}`, // Đảm bảo key là duy nhất
      });

      if (children && children.length > 0) {
         flatList = flatList.concat(flattenDestinations(children, level + 1));
      }
   });
   return flatList;
};

//Crud operations for departure point
export const getAllDeparturePoints = async () => {
   try {
      const res = await locationApi.getAllDeparturePoints();
      return res.data;
   } catch (error) {
      console.error('Lỗi khi lấy danh sách DeparturePoint:', error);
      throw error;
   }
};
export const getDeparturePointById = async (id) => {
   try {
      const res = await locationApi.getByIdDeparturePoints(id);
      return res.data;
   } catch (error) {
      console.error('Lỗi khi lấy thông tin DeparturePoint:', error);
      throw error;
   }
};
export const addDeparturePoint = async (departurePoint) => {
   try {
      const res = await locationApi.createDeparturePoints(departurePoint);
      return res.data;
   } catch (error) {
      if (error.response && error.response.data) {
         throw error.response.data;
      }
      // eslint-disable-next-line no-throw-literal
      throw { message: 'Lỗi kết nối với server' };
   }
};

export const updateDeparturePoint = async (id, departurePoint) => {
   try {
      const res = await locationApi.updateDeparturePoints(id, departurePoint);
      return res.data;
   } catch (error) {
      console.log('Lỗi API update departurePoint:', error.response);

      if (error.response && error.response.data) {
         throw error.response.data;
      }
      // eslint-disable-next-line no-throw-literal
      throw { message: 'Lỗi kết nối với server' };
   }
};

export const deleteDeparturePoint = async (id) => {
   try {
      await locationApi.deleteDeparturePoints(id);
   } catch (error) {
      console.error('Lỗi khi xóa DeparturePoint:', error);
      throw error;
   }
};
