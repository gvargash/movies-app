import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, Spin, message } from "antd";
import moment from "moment";
import { dateFormatList } from "../../../../util/config";
import app from "./../../../../util/firebaseApp";

const { Option } = Select;

const FormMovie = (props) => {
  const [form] = Form.useForm();
  const { handleCancel, getMovies, rowUpdate, isTurn, lisTurn } = props;
  const [loading, setLoading] = useState(false);
  // form && form.resetFields();

  const onFinish = (values) => {
    const db = app.firestore();
    setLoading(true);
    if (rowUpdate) {
      db.collection("movies")
        .doc(rowUpdate.uid)
        .update({
          sMovie: values.sMovie,
          dPublication: values.dPublication.format(dateFormatList[2]),
          bState: values.bState,
          nIdTurn: values.nIdTurn ?? null,
        })
        .then(() => {
          onSuccess("Datos película actualizado.");
        })
        .catch((error) => {
          onError(error);
        });
    } else {
      db.collection("movies")
        .add({
          sMovie: values.sMovie,
          dPublication: values.dPublication.format(dateFormatList[2]),
          bState: values.bState,
        })
        .then(() => {
          onSuccess();
        })
        .catch((error) => {
          onError(error);
        });
    }
  };

  const onSuccess = (text = "Película registrado con exito.") => {
    handleCancel();
    setLoading(false);
    getMovies();
    form.resetFields();
    message.success(text);
  };

  const onError = (error) => {
    message.error("Error:", error);
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (rowUpdate && form) {
      form.setFieldsValue({
        sMovie: rowUpdate.sMovie,
        dPublication: rowUpdate.dPublication && moment(rowUpdate.dPublication),
        bState: rowUpdate.bState,
        nIdTurn: rowUpdate?.nIdTurn,
      });
    } else {
      form.resetFields();
    }
  }, [rowUpdate, form]);

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" name="movieForm" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label="Nombre Película" name="sMovie" rules={[{ required: true, message: "Ingrese Nombre Película" }]}>
          <Input disabled={isTurn} />
        </Form.Item>

        <Form.Item label="Fecha de Publicación" name="dPublication" rules={[{ required: true, message: "Seleccione Fecha Publicación" }]}>
          <DatePicker format={dateFormatList[2]} disabled={isTurn} className="gx-w-100" />
        </Form.Item>

        <Form.Item label="Estado" name="bState" rules={[{ required: true, message: "Seleccione Estado" }]}>
          <Select className="gx-w-100" disabled={isTurn}>
            <Option value={true}>Activo</Option>
            <Option value={false}>Inactivo</Option>
          </Select>
        </Form.Item>
        {isTurn && lisTurn.length > 0 ? (
          <Form.Item label="Turno" name="nIdTurn">
            <Select className="gx-w-100" allowClear>
              {lisTurn.map(
                (turn) =>
                  turn.bState && (
                    <Option value={turn.uid} key={turn.uid}>
                      {(turn.dTurn && moment(turn.dTurn).format("HH:mm")) || ""}
                    </Option>
                  )
              )}
            </Select>
          </Form.Item>
        ) : null}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isTurn ? "Asignar turno" : "Grabar"}
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default FormMovie;
