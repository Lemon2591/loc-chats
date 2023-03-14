import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactScrollToBottom from "react-scroll-to-bottom";
import _ from "lodash";
import "./ChatRoom.css";
import useChat from "../useChat";
import ErrPage from "../Fearture/Err";
import axios from "axios";
import Loading from "../Fearture/Loading";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiFillBackward } from "react-icons/ai";

const ChatRoom = (props) => {
  const navigate = useNavigate();
  const dataId = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const { messages, sendMessage } = useChat(id);
  const [newMessage, setNewMessage] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataRom, setDataRom] = useState([]);
  const [dataChat, setDataChat] = useState([]);
  const [a, setA] = useState("Đang tải dữ liệu !");
  const [checkAuthMess, setCheckAuthMess] = useState(false);
  const [checkRomm, setCheckRom] = useState(true);
  const [open, setOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remove, setRemove] = useState({});

  let checkChat = false;
  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      setTimeout(async () => {
        try {
          const response = await axios.get("http://localhost:5500/group");
          setDataRom(response.data);
          setIsLoading(false);
          // eslint-disable-next-line no-unused-expressions
          const datas = await response?.data?.filter(
            (data) => data.idGr === id
          );
          await datas[0]?.member.forEach((element) => {
            if (element.idMember === dataId.id) {
              setCheckAuthMess(true);
            }
          });
        } catch (error) {
          console.log(error);
          setIsLoading(false);
          message.error("Error: Please run server !");
        }
      }, 500);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!checkAuthMess) {
        await setCheckRom(false);
        setTimeout(() => {
          setA("Đã có lỗi xảy ra, vui lòng thử lại !");
        }, 500);
      } else {
        await setCheckRom(true);
        await setA("Đang tải dữ liệu !");
      }
    })();
  }, [checkAuthMess]);

  const checkRommssss = dataRom?.filter((data) => data.idGr === id);

  const showModal = (data) => {
    setRemove(data);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsLoading(true);
    setTimeout(async () => {
      if (dataId.id !== checkRommssss[0].idAdmin) {
        setIsLoading(false);
        setIsModalOpen(false);
        return message.error("Bạn không phải là admin !");
      }
      if (remove?.idMember === dataId.id) {
        setIsLoading(false);
        setIsModalOpen(false);
        return message.error("Bạn không thể xoá người này !");
      } else {
        await _.remove(checkRommssss[0].member, (data) => {
          return data.idMember === remove?.idMember;
        });
        try {
          await axios.put(
            `http://localhost:5500/group/${checkRommssss[0].id}`,
            checkRommssss[0]
          );
          setIsLoading(false);
          setIsModalOpen(false);
          window.location.reload();
        } catch (error) {
          setIsLoading(false);
          message.error("Đã có lỗi xảy ra !");
        }
      }
    }, 500);
    // console.log(remove);
    // setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isLoading ? <Loading /> : null}
      <Modal
        title="Loại thành viên"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn muốn loại người này ra khỏi group ?</p>
      </Modal>
      {checkRomm ? (
        <div className="chat-room-container">
          <div className="header-room">
            <i onClick={() => navigate("/dashboard")}>
              <AiFillBackward />
            </i>
            <h1 className="room-name">{checkRommssss[0]?.name}</h1>
            <i onClick={() => setOpen(!open)}>
              <AiOutlineMenu />
            </i>
          </div>
          <div className="box">
            <div className={open ? "box-left" : "box-left-active"}>
              <div>
                <div className="messages-container">
                  <ReactScrollToBottom className="messages-list">
                    {/* <ol className="messages-list"> */}
                    {messages.map((message, i) => {
                      return (
                        <div className="message" key={i}>
                          <p>
                            {dataId.id === message.senderIdClient
                              ? ""
                              : message.name}
                          </p>
                          <li
                            className={`message-item ${
                              dataId.id === message.senderIdClient
                                ? "my-message"
                                : "received-message"
                            }`}
                          >
                            {" "}
                            {message.content}
                          </li>
                        </div>
                      );
                    })}
                    {/* </ol> */}
                  </ReactScrollToBottom>
                </div>
              </div>
              <div className="message-control">
                <textarea
                  value={newMessage}
                  onChange={handleNewMessageChange}
                  placeholder="Nhập tin nhắn..."
                  className="new-message-input-field"
                  style={open ? { width: "100%" } : {}}
                />
                <button
                  onClick={handleSendMessage}
                  className="send-message-button"
                >
                  Gửi tin
                </button>
              </div>
            </div>
            <div className={open ? "box-right" : "box-right-active"}>
              <h1 style={{ textAlign: "center" }}>Thông tin nhóm</h1>
              <div className="info-gr">
                <p>Mã nhóm:</p>
                <span>{checkRommssss[0]?.idGr}</span>
              </div>
              <div className="info-gr">
                <p>Tên nhóm:</p>
                <span>{checkRommssss[0]?.name}</span>
              </div>
              <div className="info-gr">
                <p>Số lượng thành viên:</p>
                <span>{checkRommssss[0]?.member?.length}</span>
              </div>
              <div className="member-all">
                {checkRommssss[0]?.member?.map((data, key) => {
                  return (
                    <div
                      className="member"
                      key={key}
                      onClick={() => showModal(data)}
                    >
                      <p>{data?.name}</p>
                      <span>
                        {checkRommssss[0]?.idAdmin === data.idMember
                          ? "admin"
                          : "Thành viên"}
                      </span>
                    </div>
                  );
                })}
              </div>
              {checkRommssss[0]?.idAdmin === dataId.id ? (
                <div className="delete-gr">
                  <button
                    onClick={() => {
                      console.log(checkRommssss[0].id);
                    }}
                  >
                    Xoá nhóm
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "600",
              textAlign: "center",
              marginTop: "200px",
            }}
          >
            {a}
          </p>
        </div>
      )}
    </>
  );
};

export default ChatRoom;
