import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import TalanLogo from "../../assets/talan-logo.png";
import { Button, Col, Input, Row, Select, Space, notification } from "antd";
import "./historiquePage.css";
import { AddTestOrPredictionModal } from "../../components/Modals";
import TesterService from "../../services/TesterServices/TesterService";
import LayoutComponent from "../../components/LayoutComponent";
import {
  FileAddOutlined,
  RadarChartOutlined,
  FileSyncOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ProfileServices from "../../services/ProfileServices";
import AdminServices from "../../services/AdminServices/AdminServices";

const Page = ({ role }) => {
  const [modalTest, setModalTest] = useState(false);
  const [testUseCase, setTestUseCase] = useState(false);
  const [statut, setStatut] = useState("");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [auth, setAuth] = useState([]);
  const [data, setData] = useState([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      notification.info({
        message: "Dataset est en cours de préparation",
        duration: 5, // The notification will not auto-close
      });
      await AdminServices.updateDataset(); // Wait for dataset update to complete

      // Simulating dataset preparation process
      setTimeout(() => {
        setLoading(false);
        notification.success({
          message: "Dataset est prêt",
          duration: 3,
        });
      }, 3000); // 3 seconds delay
    } catch (error) {
      // Handle error if the dataset update fails
      setLoading(false);
      notification.error({
        message: "Une erreur s'est produite lors de la mise à jour du dataset",
        duration: 3,
      });
    }
  };

  const handleFirst = () => {
    setStep(0);
  };
  const handleSecond = () => {
    setStep(step + 1);
  };

  const handleFinal = () => {
    setStep(step + 2);
  };

  useEffect(() => {
    ProfileServices.getInfos().then((a) => {
      setAuth(a._id);
    });
    TesterService.fetchAllTests(name, owner, statut, role, auth).then((res) =>
      setData(res)
    );
  }, [data, name, statut, owner, role, auth]);

  return (
    <>
      {role === "simpleUser" ? (
        ""
      ) : (
        <Space style={{ float: "right" }}>
          <Button
            className="button"
            size="large"
            type="primary"
            onClick={() => {
              setModalTest(true);
              setStep(0);
              setTestUseCase(true);
            }}
            style={{
              float: "right",
              marginRight: "10px",
              backgroundColor: "#00727A",
              color: "white",
            }}
            shape="round"
            icon={<FileAddOutlined spin={true} />}
          >
            Nouveau test
          </Button>

          <Button
            className="button"
            size="large"
            type="primary"
            onClick={() => {
              setModalTest(true);
              setStep(0);
              setTestUseCase(false);
            }}
            style={{
              float: "right",
              backgroundColor: "#A86DA5",
              color: "white",
            }}
            shape="round"
            icon={<RadarChartOutlined spin={true} />}
          >
            Prédiction
          </Button>
          {role === "admin" ? (
            <Button
              className={!loading ? "button" : ""}
              size="large"
              type="primary"
              style={{
                float: "right",
                backgroundColor: "#9A94C4",
                color: "white",
              }}
              disabled={loading}
              shape="round"
              icon={
                !loading ? (
                  <FileSyncOutlined spin={true} />
                ) : (
                  <LoadingOutlined spin={true} />
                )
              }
              onClick={handleClick}
            >
              Mettre à jour dataset
            </Button>
          ) : null}
        </Space>
      )}
      <Row style={{ marginBottom: "20px" }}>
        <Col span={5}>
          <Input
            placeholder="Nom du test"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
        {role === "tester" ? (
          ""
        ) : (
          <Col span={5} offset={1}>
            <Input
              placeholder="Nom du propriétaire"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </Col>
        )}
        <Col span={4} offset={1}>
          <Select
            defaultValue={statut}
            style={{ width: "100%" }}
            placeholder="Statut"
            onChange={(e) => setStatut(e)}
            options={[
              { value: "", label: "Tous" },
              { value: "Passed", label: "Passed" },
              { value: "Failed", label: "Failed" },
            ]}
          />
        </Col>
      </Row>
      <AddTestOrPredictionModal
        testUseCase={testUseCase}
        step={step}
        first={handleFirst}
        second={handleSecond}
        final={handleFinal}
        visible={modalTest}
        onCancel={() => {
          setModalTest(false);
        }}
      />
      <TableComponent data={data} isAdminPage={false} role={role} />
    </>
  );
};

export default function HistoriquePage({ role }) {
  return (
    <>
      <LayoutComponent
        role={role}
        headerLogo={TalanLogo}
        currentPage={"2"}
        mainContent={<Page role={role} />}
      ></LayoutComponent>
    </>
  );
}
