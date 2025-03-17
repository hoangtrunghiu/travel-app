import styles from '@/assets/styles/SearchTour.module.css';
import { useState } from 'react';
import { Select, DatePicker, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import clsx from 'clsx';
const departurePlaces = [
   { label: 'Hà Nội', value: 'hanoi' },
   { label: 'Sài Gòn', value: 'saigon' },
];

const destinations = [
   {
      label: 'Châu Âu',
      options: [
         { label: 'Pháp', value: 'france' },
         { label: 'Đức', value: 'germany' },
         { label: 'Ý', value: 'italy' },
      ],
   },
   {
      label: 'Châu Á',
      options: [
         { label: 'Nhật Bản', value: 'japan' },
         { label: 'Hàn Quốc', value: 'korea' },
         { label: 'Thái Lan', value: 'thailand' },
      ],
   },
   {
      label: 'Châu Phi',
      options: [
         { label: 'Ai Cập', value: 'egypt' },
         { label: 'Nam Phi', value: 'south_africa' },
      ],
   },
];

const SearchTour = () => {
   const [departure, setDeparture] = useState(null);
   const [destination, setDestination] = useState(null);
   const [date, setDate] = useState(null);

   const handleSearch = () => {
      console.log({ departure, destination, date });
   };

   return (
      <div className={styles.container}>
         <h2 className={styles.title}>Xin mời quý khách lựa chọn chuyến du lịch</h2>
         {/* <h2 className={clsx('mr-4', styles.title)}>Xin mời quý khách lựa chọn chuyến du lịch</h2> */}
         <form className={styles.searchBox}>
            <div className={styles.formItem}>
               <label>Nơi khởi hành:</label>
               <Select
                  className={styles.select}
                  placeholder="Nơi khởi hành"
                  options={departurePlaces}
                  onChange={(value) => setDeparture(value)}
               />
            </div>
            <div className={styles.formItem}>
               <label>Điểm đến:</label>
               <Select
                  className={styles.select}
                  placeholder="Điểm đến"
                  options={destinations}
                  onChange={(value) => setDestination(value)}
               />
            </div>
            <div className={styles.formItem}>
               <label>Tháng khởi hành:</label>
               <DatePicker
                  className={styles.datePicker}
                  placeholder="Tháng khởi hành"
                  picker="month"
                  onChange={(date) => setDate(date)}
               />
            </div>
            <div className={styles.formItem}>
               <label className="text-white">Tìm kiếm:</label>
               <Button type="submit" className={styles.searchBtn} onClick={handleSearch}>
                  <SearchOutlined /> Tìm Kiếm
               </Button>
            </div>
         </form>
      </div>
   );
};

export default SearchTour;
