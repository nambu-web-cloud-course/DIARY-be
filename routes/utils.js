const express = require('express');
const router = express.Router();

function getMonthRange(dateString) {
  //  const dateArray = dateString.split('-');
  //  const curYear = dateArray[0]

  const date = new Date(dateString);
  const curYear = date.getFullYear(); //2023
  const curMonth = date.getMonth();
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const beginDate = new Date(curYear, curMonth, 1).getTime();
  const endDate = new Date(curYear, curMonth + 1, 0, 23, 59, 59).getTime();
  console.log(
    new Date(beginDate + koreaTimeDiff),
    new Date(endDate + koreaTimeDiff)
  );

  return {
    begin: new Date(beginDate + koreaTimeDiff),
    end: new Date(endDate + koreaTimeDiff),
  };
}

module.export = router;

