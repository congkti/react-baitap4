export const notiFor = {
  empty: "Vui lòng không bỏ trống",
  email: "Vui lòng nhập đúng định dạng email",
  phone: "Vui lòng nhập đúng số ĐT VN",
  password: "Vui lòng nhập đúng định dạng mật khẩu",
  min: (minValue) => {
    return `Vui lòng nhập tối thiểu ${minValue} ký tự`;
  },
  max: (maxValue) => {
    return `Vui lòng nhập tối đa ${maxValue} ký tự`;
  },
};
