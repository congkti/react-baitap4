import React, { useEffect, useMemo, useState } from "react";
import "./table.scss";
import InputCustom from "./InputCustom";
import { useFormik } from "formik";
import { notiFor } from "../common/validateKey";
import * as yup from "yup";
import {
  getValueLocalStorage,
  removeVietnameseTones,
  saveLocalStorage,
} from "../../utils/utils";
import TableSinhVien from "./TableSinhVien";

const ThongTinSinhVienChinhSua = () => {
  const [arrSinhVien, setArrSinhVien] = useState([]);
  const [disabledCapNhat, setDisabledCapNhat] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredArrSinhVien, setFilteredArrSinhVien] = useState([]);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
    setValues,
    values,
    errors,
    touched,
    isValid,
  } = useFormik({
    initialValues: {
      mssv: "",
      hoTen: "",
      dienThoai: "",
      email: "",
    },
    // validate form
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

    // submit form
    onSubmit: (values) => {
      //   console.log(values);
      values && setArrSinhVien([...arrSinhVien, values]);
      values && saveLocalStorage("arrSinhVien", [...arrSinhVien, values]);
      handleReset();
    },
  });

  // lấy data local lên state
  useEffect(() => {
    let dataLocal = getValueLocalStorage("arrSinhVien");
    dataLocal && setArrSinhVien(dataLocal);
    dataLocal && setFilteredArrSinhVien(dataLocal);
  }, []);

  // chức năng xóa sv
  const handleDeleteSinhVien = (mssv) => {
    const newArrSinhVien = [...arrSinhVien];
    let index = newArrSinhVien.findIndex((item) => item.mssv == mssv);
    if (index != -1) {
      newArrSinhVien.splice(index, 1);
      setArrSinhVien(newArrSinhVien);
      saveLocalStorage("arrSinhVien", newArrSinhVien);
    }
  };

  // chức năng cập nhật sv
  const handleGetSinhVien = (sinhVien) => {
    sinhVien && setValues(sinhVien);
    setDisabledCapNhat(false);
  };
  // update sinhVien vào mảng arrSinhVien + lưu database
  const handleUpdateSinhVien = () => {
    const newArrSinhVien = [...arrSinhVien];
    let index = newArrSinhVien.findIndex((item) => item.mssv == values.mssv);
    if (index != -1) {
      newArrSinhVien[index] = values; // values = lấy dữ liệu đã sửa từ form
      setArrSinhVien(newArrSinhVien);
      saveLocalStorage("arrSinhVien", newArrSinhVien);
      handleReset();
      setDisabledCapNhat(true);
    }
  };

  // Search nhân viên theo tên
  const handleSearch = (event) => {
    setSearchKeyword(event.target.value);
  };
  // ==> cách 1: dùng useEffect
  useEffect(() => {
    if (searchKeyword) {
      let newKeyword = removeVietnameseTones(
        searchKeyword?.toLowerCase()?.trim()
      );
      const newArrSinhVien = arrSinhVien.filter((item) => {
        let matchName = removeVietnameseTones(
          item.hoTen?.toLowerCase()?.trim()
        );
        return matchName?.includes(newKeyword);
      });
      setFilteredArrSinhVien(newArrSinhVien);
    } else {
      setFilteredArrSinhVien(arrSinhVien);
    }
  }, [searchKeyword, arrSinhVien]);

  // ==> cách 2: dùng useMemo để ghi nhớ nhưng thay đổi nhỏ lặp lại khi re-render -> giúp tối ưu performance
  const searchSinhVienResult = useMemo(() => {
    let keyword = removeVietnameseTones(searchKeyword?.toLowerCase().trim());
    return arrSinhVien.filter((item) => {
      let matchName = removeVietnameseTones(item.hoTen?.toLowerCase().trim());
      return matchName?.includes(keyword);
    });
  }, [arrSinhVien, searchKeyword]);
  // => truyền props searchSinhVienResult xuống cho table hiển thị

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
            disabled={!disabledCapNhat}
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
            disabled={!isValid || !disabledCapNhat}
            type="submit"
            className="px-5 py-2 rounded-md bg-green-500 text-white hover:bg-black mr-5"
          >
            Thêm sinh viên
          </button>
          <button
            onClick={() => {
              handleReset();
              setDisabledCapNhat(true);
            }}
            type="button"
            className="px-5 py-2 rounded-md bg-red-500 text-white hover:bg-black mr-5"
          >
            Reset Form
          </button>
          <button
            disabled={disabledCapNhat || !isValid}
            onClick={handleUpdateSinhVien}
            type="button"
            className="px-5 py-2 rounded-md bg-blue-500 text-white hover:bg-black mr-5"
          >
            Cập nhật
          </button>
        </div>
      </form>

      {/* hiển thị danh sách sv */}
      <div className="mt-8">
        <input
          onInput={handleSearch}
          className="px-5 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md w-full"
          type="text"
          placeholder="Tìm sinh viên theo tên..."
        />
      </div>
      <div className="mt-5">
        <TableSinhVien
          // arrSinhVien={arrSinhVien}
          arrSinhVien={filteredArrSinhVien}
          // arrSinhVien={searchSinhVienResult}
          handleDeleteSinhVien={handleDeleteSinhVien}
          handleGetSinhVien={handleGetSinhVien}
        />
      </div>
    </div>
  );
};

export default ThongTinSinhVienChinhSua;
