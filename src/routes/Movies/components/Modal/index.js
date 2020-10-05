import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import FormMovie from "./../Form/index";
import app from "./../../../../util/firebaseApp";

const ModalMovie = (props) => {
  const { visible, handleCancel, getMovies, rowUpdate, isTurn } = props;
  const [lisTurn, setLisTurn] = useState([]);

  useEffect(() => {
    if (isTurn === true) {
      getTurns();
    }
  }, [isTurn]);

  const getTurns = async () => {
    try {
      const db = app.firestore();
      const moviesRef = await db.collection("turns").get();
      const data = moviesRef.docs.map((doc) => {
        const info = doc.data();
        const uid = doc.id;
        return { ...info, uid };
      });
      setLisTurn(data);
    } catch (error) {
      message.error("Error:", error);
    }
  };
  return (
    <Modal title={isTurn ? "ASIGNAR TURNO PELÍCULA" : rowUpdate ? "EDITAR PELÍCULA" : "NUEVA PELÍCULA"} visible={visible} footer={null} onCancel={handleCancel}>
      <FormMovie handleCancel={handleCancel} getMovies={getMovies} rowUpdate={rowUpdate} isTurn={isTurn} lisTurn={lisTurn} />
    </Modal>
  );
};

export default ModalMovie;
