import React, { useState, useEffect } from "react";
import { Button, Card, message, Table, Tag, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from "@ant-design/icons";
import { cardProps, tableProps, dateFormatList } from "../../util/config";
import moment from "moment";
import ModalMovie from "./components/Modal/index";
import app from "./../../util/firebaseApp";

const Movies = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [rowUpdate, setRowUpdate] = useState(null);
  const [isTurn, setTurn] = useState(false);

  const getMovies = async () => {
    try {
      setLoading(true);
      const db = app.firestore();
      const moviesRef = await db.collection("movies").get();
      const data = moviesRef.docs.map((doc) => {
        const info = doc.data();
        const uid = doc.id;
        return { ...info, uid };
      });
      setDataSource(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Error:", error);
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setTurn(false);
    setRowUpdate(null);
  };

  const handleOnEdit = (record, turn = false) => {
    setVisible(true);
    setRowUpdate(record);
    setTurn(turn);
  };

  const handleOnDelite = (record) => {
    const db = app.firestore();
    db.collection("movies")
      .doc(record.uid)
      .delete()
      .then(() => {
        message.success("Película eliminada con exito.");
        getMovies();
      })
      .catch((error) => {
        message.error("Error:", error);
      });
  };

  useEffect(() => {
    getMovies();
  }, []);

  const columns = [
    {
      title: "#",
      dateIndex: "nIndex",
      key: "nIndex",
      align: "center",
      width: 50,
      render: (value, record, index) => index + 1,
    },
    {
      title: "Nombre Película",
      dataIndex: "sMovie",
      key: "sMovie",
    },
    {
      title: "Fecha Publicación",
      dataIndex: "dPublication",
      key: "dPublication",
      align: "center",
      render: (value) => value && moment(new Date(value)).format(dateFormatList[2]),
    },
    {
      title: "Estado",
      dataIndex: "bState",
      key: "bState",
      align: "center",
      render: (value) => (value ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>),
    },
    {
      dataIndex: "sAcciones",
      key: "sAcciones",
      align: "center",
      width: 150,
      render: (value, record) => (
        <div className="gx-d-flex gx-space-between">
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} size="small" type="primary" ghost onClick={() => handleOnEdit(record)} />
          </Tooltip>
          <Tooltip title="Asignar turno">
            <Button icon={<CalendarOutlined />} size="small" type="default" onClick={() => handleOnEdit(record, true)} />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} size="small" type="danger" danger onClick={() => handleOnDelite(record)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="PELÍCULAS"
      {...cardProps}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Nuevo
        </Button>
      }
    >
      <Table columns={columns} {...tableProps} dataSource={dataSource} rowKey={(record) => record.uid} loading={loading} />
      <ModalMovie visible={visible} handleCancel={handleCancel} getMovies={getMovies} rowUpdate={rowUpdate} isTurn={isTurn} />
    </Card>
  );
};

export default Movies;
