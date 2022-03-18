/* eslint-disable array-callback-return */

import React from "react";

import classes from "./Card.module.css";

const Card = ({ data }) => {
  return (
    <div className={`${classes.Card} text-center text-info`}>
      {data.map((item) => {
        console.log(item.name);
        if (item.name !== "null - null") {
          return <p className={`${classes.CardInner}`}>{item.name}</p>;
        }
      })}
    </div>
  );
};

export default Card;
