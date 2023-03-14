import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import Loading from "../Fearture/Loading";
function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    userName: "",
    passWord: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    if (data.userName === "" || data.passWord === "") {
      message.error("Vui lòng nhập đủ tài khoản và mật khẩu !");
    } else {
      setIsLoading(true);
      try {
        const res = await axios.post(
          "https://alo-server.onrender.com/api/user/data/patient",
          data
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        setIsLoading(false);
        navigate("/dashboard");
      } catch (error) {
        setIsLoading(false);
        message.error(error.response.data.message);
      }
    }
  };
  return (
    <>
      {isLoading ? <Loading /> : null}
      <div className="login-container">
        <div className="login-content">
          <div className="banner">
            <div className="img">
              <div className="bg-login"></div>
              <div className="form-login">
                <span
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: "3.4rem",
                    margin: "4rem 0 2rem 0",
                  }}
                >
                  Rental Car
                </span>
                <span
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: "1.6rem",
                  }}
                >
                  Đặt xe ngay bây giờ !
                </span>
                <p>Đăng nhập</p>
                <div className="input">
                  <label htmlFor="">Tên tài khoản</label>
                  <input
                    placeholder="Nhập tài khoản..."
                    type="text"
                    onChange={(e) => {
                      setData((pre) => {
                        return { ...pre, userName: e.target.value };
                      });
                    }}
                  />
                </div>

                <div className="input">
                  <label htmlFor="">Mật khẩu</label>
                  <input
                    placeholder="Nhập mật khẩu..."
                    type="password"
                    onChange={(e) => {
                      setData((pre) => {
                        return { ...pre, passWord: e.target.value.trim() };
                      });
                    }}
                  />
                </div>

                <div className="input" style={{ textAlign: "center" }}>
                  <button className="btn" onClick={handleLogin} type="submit">
                    Đăng nhập
                  </button>
                </div>
                <div
                  className="input"
                  style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      marginBottom: "2.5rem",
                      fontSize: "1.4rem",
                    }}
                  >
                    Bạn chưa có tài khoản ? &nbsp;
                  </p>
                  <NavLink className="login-rg" to="/register">
                    Đăng ký ngay.
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;