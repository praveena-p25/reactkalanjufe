/* eslint-disable react-hooks/exhaustive-deps */
import { getTodayLeaves } from "Api/Leaves";
import Modal from "components/common/Modal/Modal";
import ModalForm from "components/common/ModalForm/ModalForm";
import Pagination from "components/projects/Pagination/Pagination";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import showNotification from "utils/showNotification";
import CommonLeavesTable from "../CommonLeavesTable/CommonLeavesTable";
import classes from "./TodayLeaves.module.css";

const TodayLeaves = ({ formData }) => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);

  //LOADER
  const [loader, setloader] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [leavesCount, setLeavesCount] = useState(0);
  const [perPage, setPerPage] = useState(+query.get("per") || 5);
  const [currPage, setCurrPage] = useState(+query.get("curr") || 1);

  // FETCH TODAY LEAVES
  const fetchTodayLeaves = async () => {
    setloader(true);
    try {
      const responseData = await getTodayLeaves({
        currPage: +currPage || 1,
        perPage: +perPage || 5,
      });
      setLeaves(responseData.data);
      setLeavesCount(responseData.count);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setloader(false);
    }
  };

  // use effect for filters
  useEffect(() => {
    fetchTodayLeaves();
  }, [currPage, perPage, history]);

  return (
    <div className={classes.TodayLeaves}>
      <CommonLeavesTable formData={formData} data={leaves} loading={loader} />
      <Pagination
        tableDataCount={leavesCount}
        perPage={perPage}
        setPerPage={setPerPage}
        currentPagination={currPage}
        setCurrentPagination={setCurrPage}
        perPageOption={[5, 10, 15, 20]}
      />
      <Modal
        show={show}
        setShow={setShow}
        title="Leave Details"
        save={null}
        cancel={null}
      >
        <ModalForm data={formData}></ModalForm>
      </Modal>
    </div>
  );
};

export default TodayLeaves;
