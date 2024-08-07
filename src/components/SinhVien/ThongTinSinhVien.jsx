import React, { useEffect, useState } from "react";
import InputCustom from "./InputCustom";
import TableSinhVien from "./TableSinhVien";
import { useFormik } from "formik";
import * as yup from "yup";
import "./table.scss";
import {
  getValueLocalStorage,
  removeVietnameseTones,
  saveLocalStorage,
} from "../../utils/utils";
import { notiFor } from "../common/validateKey";

const ThongTinSinhVien = () => {
  // 3. Tạo Table để hiển thị dữ liệu > tách component

  // 2. Tạo State để quản lý mảng sinh viên. Gọi formik để submit form -> hiển thị dữ liệu mảng lên giao diện table
  const [arrSinhVien, setArrSinhVien] = useState([]);
  const [filterArrSinhVien, setFilterArrSinhVien] = useState([]);

  // 1. Xây dựng form dùng Formik
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    setValues,
    isValid,
    dirty,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      mssv: "",
      hoTen: "",
      dienThoai: "",
      email: "",
    },
    // 5. xử lý validate form bằng yup
    validationSchema: yup.object({
      mssv: yup
        .string()
        .required(notiFor.empty)
        .min(4, "Nhập tối thiểu 4 ký tự")
        .max(6, "Nhập tối đa 6 ký tự"),
      hoTen: yup
        .string()
        .required(notiFor.empty)
        .matches(/^[A-Za-zÀ-ỹà-ỹ\s]+$/, "Vui lòng nhập tên không chứa số"),
      dienThoai: yup
        .string()
        .required(notiFor.empty)
        .matches(
          /(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}(?:[^\d]+|$)/,
          "Vui lòng nhập đúng định dạng số ĐT VN"
        ),
      email: yup.string().email(notiFor.email).required(notiFor.empty),
    }),
    onSubmit: (values, { resetForm }) => {
      // copy mảng mới > truyền thuộc tính của object từ formik vào trước khi setState để đảm bảo giữ đúng cấu trúc mảng của arrSinhVien
      console.log(!values);
      setArrSinhVien([...arrSinhVien, values]);
      saveLocalStorage("arrSinhVien", [...arrSinhVien, values]);
      resetForm();
    },
  });

  // 4. Tạo useEffect để chạy lấy dữ liệu từ localStorage -> update state
  useEffect(() => {
    const dataLocal = getValueLocalStorage("arrSinhVien");
    dataLocal && setArrSinhVien(dataLocal);
    dataLocal && setFilterArrSinhVien(dataLocal);
  }, []);

  // 5. Xóa sinhVien
  const handleDeleteSinhVien = (mssv) => {
    const newArrSinhVien = [...arrSinhVien];
    let index = newArrSinhVien.findIndex((item) => item.mssv == mssv);
    if (index != -1) {
      newArrSinhVien.splice(index, 1);
      setArrSinhVien(newArrSinhVien);
      setFilterArrSinhVien(newArrSinhVien);
      saveLocalStorage("arrSinhVien", newArrSinhVien);
    }
  };

  // 6. Sửa thông tin sinhVien
  const [sinhVien, setSinhVien] = useState([]);

  // lấy tất cả thông tin của sinhVien cần sửa để setState re-render giao diện
  const handleGetSinhVien = (sinhVien) => {
    setSinhVien(sinhVien);
  };

  // chạy 1 useEffect sau khi state re-render, đưa tất cả thông tin sinhVien lưu trên State lên form input thông qua phương thức setValues của Formik
  useEffect(() => {
    sinhVien && setValues(sinhVien);
  }, [sinhVien]);

  // update sinhVien vào mảng arrSinhVien + lưu database
  const handleUpdateSinhVien = () => {
    const newArrSinhVien = [...arrSinhVien];
    let index = newArrSinhVien.findIndex((item) => item.mssv == sinhVien.mssv);
    console.log(index, sinhVien.mssv);
    console.log(values);
    if (index != -1) {
      newArrSinhVien[index] = values; // values = lấy dữ liệu đã sửa từ form
      setArrSinhVien(newArrSinhVien);
      setFilterArrSinhVien(newArrSinhVien);
      saveLocalStorage("arrSinhVien", newArrSinhVien);
    }
    console.log(newArrSinhVien);
  };

  // 7. Search nhân viên theo tên
  const handleSearch = (event) => {
    let keyword = removeVietnameseTones(
      event.target.value.toLowerCase().trim()
    );
    let arrSinhVienFilter = arrSinhVien.filter((item, index) => {
      let matchName = removeVietnameseTones(item.hoTen.toLowerCase().trim());
      return matchName.includes(keyword);
    });
    console.log(arrSinhVienFilter);
    // đưa lên giao diện
    setFilterArrSinhVien(arrSinhVienFilter);
  };

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-8 min-h-screen">
      <h2 className="bg-gray-800 text-white text-2xl px-5 py-2 mb-5">
        Thông tin sinh viên
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5">
          <InputCustom
            contentLabel="Mã SV"
            placeHolder="Vui lòng nhập mã SV"
            name="mssv"
            value={values.mssv}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.mssv}
            touched={touched.mssv}
          />
          <InputCustom
            contentLabel="Họ tên"
            placeHolder="Vui lòng nhập họ tên"
            name="hoTen"
            value={values.hoTen}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.hoTen}
            touched={touched.hoTen}
          />
          <InputCustom
            contentLabel="Số điện thoại"
            placeHolder="Vui lòng nhập số ĐT"
            name="dienThoai"
            value={values.dienThoai}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.dienThoai}
            touched={touched.dienThoai}
          />
          <InputCustom
            contentLabel="Email"
            placeHolder="Vui lòng nhập email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
          />
        </div>
        <div className="mt-5">
          <button
            disabled={!isValid || !dirty}
            type="submit"
            className="px-5 py-2 rounded-md bg-green-500 text-white hover:bg-black mr-5"
          >
            Thêm sinh viên
          </button>
          <button
            type="button"
            className="px-5 py-2 rounded-md bg-red-500 text-white hover:bg-black mr-5"
            onClick={resetForm}
          >
            Reset Form
          </button>
          <button
            onClick={() => {
              if (!isValid) {
                return;
              }
              handleUpdateSinhVien();
            }}
            type="button"
            className="px-5 py-2 rounded-md bg-blue-500 text-white hover:bg-black mr-5"
          >
            Cập nhật
          </button>
        </div>
      </form>
      <div className="mt-8">
        <input
          onInput={handleSearch}
          className="px-5 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md w-full"
          type="text"
          placeholder="Search..."
        />
      </div>
      <div className="mt-5">
        <TableSinhVien
          // arrSinhVien={arrSinhVien}
          arrSinhVien={filterArrSinhVien}
          handleDeleteSinhVien={handleDeleteSinhVien}
          handleGetSinhVien={handleGetSinhVien}
        />
      </div>
    </div>
  );
};

export default ThongTinSinhVien;
