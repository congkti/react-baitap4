import React from "react";
import { Space, Table, Tag } from "antd";

// const data = [
//   {
//     key: "1",
//     mssv: "SV001",
//     hoTen: "Hữu Công",
//     dienThoai: "0988999777",
//     email: "congkti@gmail.com",
//   },
// ];

const TableSinhVien = ({
  arrSinhVien,
  handleDeleteSinhVien,
  handleGetSinhVien,
}) => {
  const columns = [
    {
      title: "Mã số SV",
      dataIndex: "mssv",
      key: "mssv",
    },
    {
      title: "Tên sinh viên",
      dataIndex: "hoTen",
      key: "hoTen",
    },
    {
      title: "Số điện thoại",
      dataIndex: "dienThoai",
      key: "dienThoai",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => {
              console.log(record);
              handleGetSinhVien(record);
            }}
            className="py-2 px-5 bg-yellow-500 text-white rounded-lg"
          >
            Sửa
          </button>
          <button
            onClick={() => {
              handleDeleteSinhVien(record.mssv);
            }}
            className="py-2 px-5 bg-red-500 text-white rounded-lg"
          >
            Xóa
          </button>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={arrSinhVien} />;
};

export default TableSinhVien;
