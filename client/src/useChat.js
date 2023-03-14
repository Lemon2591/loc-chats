import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { message } from "antd";
import { useParams } from "react-router-dom";
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://localhost:4000";
const dataId = JSON.parse(localStorage.getItem("user"))

const useChat = (roomId) => {
  const { id } = useParams()
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    (async function () {
      setTimeout(async () => {
        try {
          const response = await axios.get("http://localhost:5500/message");
          await response?.data?.forEach(element => {
            if (element.idGr === id) {
              setMessages((pre) => {
                return [...pre, element]
              })
            }
          });
          // setMessages(response.data);
        } catch (error) {
          console.log(error);
          message.error("Error: Please run server !");
        }
      }, 500);
    })();
  }, []);

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = async (messageBody) => {
    const data = {
      content: messageBody,
      senderId: socketRef.current.id,
      senderIdClient: dataId.id,
      name: dataId.userName,
      idGr: id
    }
    try {
      await axios.post("http://localhost:5500/message", data)
      await socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, data);
    } catch (error) {
      message.error("Đã có lỗi xảy ra !")
    }

  };

  return { messages, sendMessage };
};

export default useChat;
