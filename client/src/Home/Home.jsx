import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import "./Home.css";
import Loading from "../Fearture/Loading";

const Home = () => {
  const navigate = useNavigate();
  const dataId = JSON.parse(localStorage.getItem("user"));
  const [roomName, setRoomName] = useState("");
  const [dataGr, setDataGr] = useState([]);
  const [dataGr3, setDataGr3] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [dataJoin, setDataJoin] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [join, setJoin] = useState({});
  const [dataSearch, setDataSearch] = useState("");

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      setTimeout(async () => {
        try {
          const response = await axios.get("http://localhost:5500/group");
          setDataGr(response.data);
          setDataGr3(response.data);

          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          message.error("Error: Please run server !");
        }
      }, 500);
    })();
  }, []);
  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };
  const handleCreateGr = async () => {
    const makeid = (length) => {
      var text = "";
      var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    };
    const data = {
      img: "https://thuthuatnhanh.com/wp-content/uploads/2022/06/Anh-meme-cheems-trng-thu.jpg",
      idGr: makeid(10),
      name: roomName,
      idAdmin: dataId.id,
      member: [
        {
          idMember: dataId.id,
          name: dataId.userName,
        },
      ],
    };
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5500/group", data);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoin = (data) => {
    setRoomName(data.idGr);
    navigate(`/message/${data.idGr}`);
  };

  let flag = [];
  dataGr.forEach((element) => {
    if (element.member?.length == 1) {
      if (element.member[0].idMember === dataId.id) {
        flag.push(element);
      }
    }
    if (element.member.length > 1) {
      element.member.forEach((data) => {
        if (data.idMember === dataId.id) {
          flag.push(element);
        }
      });
    }
  });

  const handleJoinOther = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      const data = await dataGr?.filter((e) => e.idGr === dataJoin);
      if (data?.length > 0) {
        const test = await data[0]?.member?.filter(
          (e) => e.idMember === dataId.id
        );
        if (test?.length > 0) {
          navigate(`/message/${dataJoin}`);
        } else {
          const dataUpdate = {
            idMember: dataId.id,
            name: dataId.userName,
          };
          try {
            await data[0].member.push(dataUpdate);
            const idUpdate = data[0].id;
            await axios.put(`http://localhost:5500/group/${idUpdate}`, data[0]);
            setIsLoading(false);
            navigate(`/message/${dataJoin}`);
          } catch (error) {
            message.error("Đã có lỗi xảy ra !");
          }
        }
      } else {
        setIsLoading(false);
        message.error("Không tìm thấy nhóm !");
      }
    }, 500);
  };

  const showModal = (data) => {
    setJoin(data);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsLoading(true);
    setTimeout(async () => {
      const test = await join?.member?.filter((e) => e.idMember === dataId.id);
      console.log(test);
      if (test?.length > 0) {
        navigate(`/message/${join.idGr}`);
      } else {
        const dataUpdate = {
          idMember: dataId.id,
          name: dataId.userName,
        };
        try {
          await join.member.push(dataUpdate);
          const idUpdate = join.id;
          console.log(join);
          await axios.put(`http://localhost:5500/group/${idUpdate}`, join);
          setIsLoading(false);
          setIsModalOpen(false);
          navigate(`/message/${join.idGr}`);
        } catch (error) {
          setIsLoading(false);
          message.error("Đã có lỗi xảy ra !");
        }
      }
    }, 500);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (dataGr?.length > 0) {
      if (dataSearch !== "") {
        setDataGr3(dataGr?.filter((data) => data.idGr === dataSearch));
      } else {
        setDataGr3(dataGr);
      }
    }
  }, [dataSearch]);

  return (
    <>
      {isLoading ? <Loading /> : null}
      <Modal
        title="Vào nhóm bạn có thể biết !"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn có muốn truy cập vào nhóm này không ?</p>
      </Modal>
      <div className="home-container">
        <div className="home-header">
          <div className="home-search">
            <Input
              placeholder="Tìm kiếm nhóm chat"
              onChange={(e) => setDataSearch(e.target.value.trim())}
            />
          </div>
          <div className="home-user">Xin chào: {dataId.userName}</div>
        </div>
        <div className="home-header">
          <div className="home-search">
            <Input
              placeholder="Nhập mã nhóm"
              value={dataJoin}
              onChange={(e) => setDataJoin(e.target.value)}
            />
          </div>
          <div className="home-user">
            <Button type="primary" onClick={handleJoinOther}>
              Vào nhóm
            </Button>
          </div>
        </div>
        <div className="home-body">
          <h1>Nhóm của bạn</h1>
          <div className="home-gr-i">
            <div className="home-gr-items">
              {flag.length > 0 ? (
                flag?.map((data, index) => {
                  return (
                    <div
                      className="home-gr-item"
                      key={index}
                      onClick={() => {
                        handleJoin(data);
                      }}
                    >
                      <div className="home-gr-item-img">
                        <img src={data.img} alt="" />
                      </div>
                      <div className="home-gr-item-text">
                        <p>{data.name}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ width: "100%" }} className="avc">
                  <p
                    style={{
                      textAlign: "center",
                      display: "block",
                      fontSize: "16px",
                      width: "100%",
                    }}
                  >
                    Bạn chưa có đoạn chat nào, chat ngay ?
                  </p>
                  <input
                    type="text"
                    placeholder="Room"
                    value={roomName}
                    onChange={handleRoomNameChange}
                    className="text-input-field"
                  />
                  <button
                    onClick={handleCreateGr}
                    className="enter-room-button"
                  >
                    Tạo đoạn chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="home-body"
          style={{
            marginBottom: "200px",
          }}
        >
          <h1>Bạn có thể biết</h1>
          <div className="home-gr-i">
            <div className="home-gr-items">
              {dataGr3?.map((data, index) => {
                return (
                  <div
                    className="home-gr-item"
                    key={index}
                    onClick={() => showModal(data)}
                  >
                    <div className="home-gr-item-img">
                      <img src={data.img} alt="" />
                    </div>
                    <div className="home-gr-item-text">
                      <p>{data.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
