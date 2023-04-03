import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import TalanLogo from "../../assets/talan-logo.png";
import { Button, Col, Input, Row, Select } from "antd";
import "./historiquePage.css";
import { AddTestModal,  } from "../../components/Modals";
import TesterService from "../../services/TesterServices/TesterService";
import LayoutComponent from "../../components/LayoutComponent";
import { FileAddOutlined } from "@ant-design/icons";
import ProfileServices from "../../services/ProfileServices";

const Page = ({ role }) => {
  const [modalTest, setModalTest] = useState(false);
  const [statut, setStatut] = useState("");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [auth, setAuth] = useState([]);
  const [data, setData] = useState([]);
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
        <Button
          size="large"
          type="primary"
          onClick={() => setModalTest(true)}
          style={{
            float: "right",
            marginBottom: "30px",
            backgroundColor: "#2596be",
            color: "white",
          }}
          shape="round"
          icon={<FileAddOutlined spin={true} />}
        >
          Nouveau test
        </Button>
      )}
      <Row>
        <Col span={5}>
          <Input
            placeholder="Nom du test"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
        {role === "testeur" ? (
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
      <AddTestModal
        visible={modalTest}
        onCancel={() => {
          setModalTest(false);
        }}
      />
      {/* <TestProgressModel  /> */}
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
