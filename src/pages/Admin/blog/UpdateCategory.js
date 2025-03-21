import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CategoryForm from '@/components/Admin/Form/CategoryForm';
import categoryApi from '@/api/categoryApi';

export default function UpdateCategory() {
   const { id } = useParams();
   const [category, setCategory] = useState([]);

   useEffect(() => {
      fetchCategoryById();
   }, []);

   const fetchCategoryById = async () => {
      try {
         const response = await categoryApi.getById(id);
         // console.log('Fetched category:', response.data);
         setCategory(response.data);
      } catch (error) {
         console.error('Lỗi khi lấy category:', error);
      }
   };

   return <CategoryForm categoryUpdate={category} />;
}
