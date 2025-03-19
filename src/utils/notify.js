import { notification } from 'antd';

export const useNotify = () => {
   const [api, contextHolder] = notification.useNotification();

   const notifySuccess = (message, description) => {
      api.success({
         message,
         description,
         duration: 3,
      });
   };

   const notifyError = (message, description) => {
      api.error({
         message,
         description,
         duration: 3,
      });
   };

   return { notifySuccess, notifyError, contextHolder };
};
