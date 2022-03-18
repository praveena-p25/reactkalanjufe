import { useAxiosLoader } from "Api/httpRequest";
import SearchFilter from "components/clients/SearchFilter/SearchFilter";
import ModalComp from "components/common/Modal/Modal";
import ModalForm from "components/common/ModalForm/ModalForm";
import TablePagination from "components/common/TablePagination/TablePagination";
import FormContainer from "components/Company/EditCompany/FormikFormContainer/FormContainer";
import LoadingPage from "pages/Loading/Loading";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { dateFormat } from "utils/dateFormat";
import { checkQuery, checkQueryString } from "utils/queryString";
import showNotification from "utils/showNotification";
import {
  allocateAsset,
  getAllAssignedAssets,
  returnAsset,
} from "../../../../Api/assets";
import checkSvg from "../../../../assets/check.svg";
import eyeIconSvg from "../../../../assets/eyeIcon.svg";
import classes from "./AllAssignedAsset.module.css";
const returnAssetsForm = [
  {
    type: "input",
    inputType: "date",
    label: "Returned On",
    required: true,
    placeholder: "Returned On",
    state: "returned_on",
    value: "",
  },
  {
    type: "textarea",
    label: "Return Condition Notes",
    required: true,
    placeholder: "Return Condition Notes",
    state: "returned_conditional_notes",
    value: "",
    gridColumn: "span 2",
  },
];

const AllAssignedAsset = (props) => {
  const history = useHistory();
  const [load] = useAxiosLoader();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [tableData, setTableData] = useState({
    head: [],
    body: [],
  });
  const [returnAssetsFormData, setreturnAssetsFormData] =
    useState(returnAssetsForm);
  const [showCondition, setShowCondition] = useState(false);
  const [showReturnAssets, setShowReturnAssets] = useState(false);
  const [returnAssetConditionData, setReturnAssetConditionData] = useState([]);
  const [searchFilterState, setSearchFilterState] = useState({
    resource_name: checkQuery(query, "resource_name", ""),
    item_type: checkQuery(query, "item_type", ""),
    make: checkQuery(query, "make", ""),
    model: checkQuery(query, "model", ""),
    returnable: checkQuery(query, "returnable", ""),
    serial_number: checkQuery(query, "serial_number", ""),
  });
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [perPage, setPerPage] = useState(checkQueryString(query, "per", 10));
  const [currentPagination, setCurrentPagination] = useState(
    checkQueryString(query, "curr", 1)
  );

  const [currentAssetId, setCurrentAssetId] = useState({});
  const [searchFilterFields] = useState([
    {
      type: "input",
      placeholder: "Resource",
      state: "resource_name",
      value: checkQuery(query, "resource_name", ""),
    },
    {
      type: "input",
      placeholder: "Serial No",
      state: "serial_number",
      value: checkQuery(query, "serial_number", ""),
    },
    {
      type: "input",
      placeholder: "Asset Type",
      state: "item_type",
      value: checkQuery(query, "item_type", ""),
    },
    {
      type: "input",
      placeholder: "Make",
      state: "make",
      value: checkQuery(query, "make", ""),
    },
    {
      type: "input",
      placeholder: "Model",
      state: "model",
      value: checkQuery(query, "model", ""),
    },
    {
      type: "select",
      defaultOption: {
        name: "Returnable or Not",
        disabled: true,
        default: true,
        hidden: true,
      },
      options: [
        {
          name: "Returnable or Not",
          disabled: true,
          default: true,
          hidden: true,
        },
        { name: "Returnable", value: "yes" },
        { name: "Non Returnable", value: "no" },
      ],
      state: "returnable",
      value: checkQuery(query, "returnable", ""),
    },
  ]);
  const allocateAssetHandler = async (values) => {
    try {
      await allocateAsset({
        _data: values,
      });
      showNotification("Asset Allocated", "success");
      props.setShowAllocateAssets(false);
      fetchTableData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleReturnClick = (asset) => {
    setreturnAssetsFormData([
      {
        type: "input",
        inputType: "date",
        label: "Returned On",
        required: true,
        placeholder: "Returned On",
        state: "returned_on",
        min: dateFormat(
          "-",
          new Date(asset.given_on).setDate(
            new Date(asset.given_on).getDate() + 1
          )
        ),
        value: "",
      },
      {
        type: "textarea",
        label: "Return Condition Notes",
        required: true,
        placeholder: "Return Condition Notes",
        state: "returned_conditional_notes",
        value: "",
        gridColumn: "span 2",
      },
    ]);
    setCurrentAssetId(asset);
    setShowReturnAssets(true);
  };

  const returnAssetsHandler = async (values) => {
    try {
      const res = await returnAsset({
        _data: {
          id: currentAssetId.id,
          asset_id: currentAssetId.asset_id,
          returned_on: values.returned_on,
          returned_conditional_notes: values.returned_conditional_notes,
        },
      });
      showNotification(res.message, "success");
      props.fetchAllocateassetData();
      setShowReturnAssets(false);
      fetchTableData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleEyeIconClick = (givenNotes, returnNotes, returned_on) => {
    if (returned_on) {
      setReturnAssetConditionData([
        {
          type: "textarea",
          label: "Given Condition Notes",
          disabled: true,
          value: givenNotes,
        },
        {
          type: "textarea",
          label: "Return Condition Notes",
          disabled: true,
          value: returnNotes,
        },
      ]);
    } else {
      setReturnAssetConditionData([
        {
          type: "textarea",
          label: "Given Condition Notes",
          disabled: true,
          value: givenNotes,
        },
      ]);
    }

    setShowCondition(true);
  };

  const handleSearchFilter = (searchFilterState) => {
    setCurrAndQueryWithoutPush();
    for (let k in searchFilterState) {
      if (searchFilterState[k] !== "" && searchFilterState[k] !== null) {
        query.set(k, searchFilterState[k]);
      } else {
        query.delete(k);
      }
    }
    history.push({
      pathname: location.pathname,
      search: query.toString(),
    });
    setSearchFilterState(searchFilterState);
  };

  const fetchTableData = async () => {
    const { data } = await getAllAssignedAssets({
      _data: searchFilterState,
      page: currentPagination,
      limit: perPage,
    });
    setTotalDataCount(data.total);
    setTableData(() => {
      const updatedState = {
        head: [
          "Resource Name",
          "Type",
          "Make-Model",
          "Serial No",
          "GivenOn",
          "Returnable",
          "Returned On",
        ],
        body: [],
      };
      for (let item of data.data) {
        updatedState.body.push([
          item.resource_name ? (
            <Link to={`/resource?name=${item.resource_name}`}>
              {item.resource_name}
            </Link>
          ) : (
            "N/A"
          ),
          item.item_type,
          <Link to={`/asset/${item.asset_id}`}>
            {item.make || "N/A"}-{item.model || "N/A"}
          </Link>,
          item.serial_number || "N/A",
          new Date(item.given_on).toDateString() || "N/A",
          item.returnable === "Yes" || item.returnable === "yes" ? (
            <img src={checkSvg} alt="check" />
          ) : (
            "N/A"
          ),
          item.returned_on ? (
            new Date(item.returned_on).toDateString()
          ) : (
            <Link onClick={() => handleReturnClick(item)}>Return</Link>
          ),
          <img
            onClick={() =>
              handleEyeIconClick(
                item.given_conditional_notes,
                item.returned_conditional_notes,
                item.returned_on
              )
            }
            src={eyeIconSvg}
            alt="Eye Icon"
            style={{ cursor: "pointer" }}
          />,
        ]);
      }
      return updatedState;
    });
  };

  useEffect(() => {
    fetchTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilterState, currentPagination, perPage]);

  useEffect(() => {
    if (query.get("curr")) {
      setCurrentPagination(parseInt(query.get("curr")));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.get("curr")]);

  useEffect(() => {
    if (query.get("per")) {
      setPerPage(parseInt(query.get("per")));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.get("per")]);
  const setCurrAndQueryWithoutPush = () => {
    setCurrentPagination(1);
    query.set("curr", 1);
    query.set("per", perPage);
  };

  return (
    <div className={classes.AllAssignedAsset}>
      <SearchFilter
        page={"client"}
        fields={searchFilterFields}
        setDisplayData={() => {}}
        passStateToParent={handleSearchFilter}
      />
      <TablePagination
        data={tableData}
        dataCount={totalDataCount}
        // passPaginationUp={handlePagination}

        perPageCustom={perPage}
        setPerPageCustom={setPerPage}
        currentPaginationCustom={currentPagination}
        setCurrentPaginationCustom={setCurrentPagination}
      />
      <ModalComp
        title="Condition Notes"
        show={showCondition}
        setShow={setShowCondition}
        cancel="Close"
        save={null}
      >
        <ModalForm data={returnAssetConditionData} />
      </ModalComp>
      <ModalComp
        title="Return Assets"
        show={showReturnAssets}
        setShow={setShowReturnAssets}
        cancel={null}
        save={null}
      >
        <FormContainer
          data={returnAssetsFormData}
          formSubmitHandler={returnAssetsHandler}
          cancelHandler={() => setShowReturnAssets(false)}
        />
      </ModalComp>

      <ModalComp
        title="Allocate Assets"
        show={props.showAllocateAssets}
        setShow={props.setShowAllocateAssets}
        cancel={null}
        save={null}
      >
        <FormContainer
          data={props.allocateAssetsFormData}
          formSubmitHandler={allocateAssetHandler}
          cancelHandler={() => props.setShowAllocateAssets(false)}
        />
      </ModalComp>
      {load && <LoadingPage />}
    </div>
  );
};

export default AllAssignedAsset;
