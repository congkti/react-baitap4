import React from "react";

const InputCustom = ({
  contentLabel,
  placeHolder,
  name,
  value,
  className = "",
  type = "text",
  classWrapper = "",
  onChange,
  onBlur,
  error,
  touched,
}) => {
  return (
    <div className={classWrapper}>
      <label className="block mb-2 text-sm font-medium text-black">
        {contentLabel}
      </label>
      <input
        className={`px-5 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${className}`}
        type={type}
        name={name}
        placeholder={placeHolder}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
      {/* error message */}
      {error && touched && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default InputCustom;
