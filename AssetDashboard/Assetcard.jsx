import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useHistory } from "react-router";

import classes from "./AssetCard.module.css";

const Assetcard = (props) => {
  const history = useHistory();
  const [ownedby, setOwnedby] = useState("");
  const [name, setName] = useState(0);
  const [itemType, setItemType] = useState("");
  let a = parseInt(props.amount) || 0;
  useEffect(() => {
    if (props.title === "Codingmart Technologies Private Limited") {
      setOwnedby("Self");
      setName("");
      setItemType("");
    } else if (props.title === "Clients") {
      setOwnedby("Client");
      setName("");
      setItemType("");
    } else if (props.title === "Haimavathi" || props.title === "Sri Infotech") {
      setOwnedby("Vendor");
      if (props.title === "Haimavathi") {
        setName(5);
      } else {
        setName(6);
      }
      setItemType("");
    } else if (props.title === "Mobile") {
      setItemType("mobile phones");
      setOwnedby("");
      setName("");
    } else {
      setOwnedby("");
      setName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={classes.card} style={{ backgroundColor: props.color }}>
      <div className={classes.cardbody}>
        <h5 className={classes.cardtitle}>{props.title}</h5>
        <h6 className={classes.amount}>₹{a.toLocaleString("en-IN")}</h6>

        <Row style={{ paddingTop: "10px", position: "relative", top: "5px" }}>
          <Col sm={8} md={4} style={{ textAlign: "left", fontSize: "144%" }}>
            <p
              className={classes.tag}
              onClick={() => {
                history.push({
                  pathname: "/asset-resource",
                  search:
                    "?item_type=" +
                    itemType +
                    "&owned_by=" +
                    ownedby +
                    "&vendor_id=" +
                    name +
                    "&tab=2&status=1",
                });
              }}
            >
              {props.total}
            </p>
          </Col>

          <Col md={5} style={{ textAlign: "center", fontSize: "144%" }}>
            <p
              className={classes.tag}
              onClick={() => {
                history.push({
                  pathname: "/asset-resource",
                  search:
                    "?item_type=" +
                    itemType +
                    "&owned_by=" +
                    ownedby +
                    "&vendor_id=" +
                    name +
                    "&availability=" +
                    "Assigned&tab=2&status=1",
                });
              }}
            >
              {props.assigned}
            </p>
          </Col>

          <Col md={3} style={{ textAlign: "center", fontSize: "144%" }}>
            <p
              className={classes.tag}
              onClick={() => {
                history.push({
                  pathname: "/asset-resource",
                  search:
                    "?item_type=" +
                    itemType +
                    "&owned_by=" +
                    ownedby +
                    "&vendor_id=" +
                    name +
                    "&availability=Idle&tab=2&status=1",
                });
              }}
            >
              {props.idle}
            </p>
          </Col>
        </Row>
        <Row style={{ position: "relative", bottom: "5px" }}>
          <Col md={4} style={{ fontSize: "12px" }}>
            <p>Total</p>
          </Col>
          <Col md={5} style={{ textAlign: "left", fontSize: "12px" }}>
            <p>Assigned</p>
          </Col>
          <Col md={3} style={{ textAlign: "center", fontSize: "12px" }}>
            <p>Idle</p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Assetcard;
