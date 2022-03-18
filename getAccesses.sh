#!/bin/bash
if [ "$1" == "start" ] && [ -z "$(which jq)" ];
then
  echo "Installing jq for JSON formatting";
  sudo apt install jq -y;
fi
echo "Getting All accesses from DB";
export ALL_ACCESSES=`curl "https://accessms-alpha.kalanju.com/get-all-accesses?secret=$ACCESS_SECRET"`;
if [[ $ALL_ACCESSES == *'special_super-admin'* ]];
then
  echo -n 'export const allAccesses = ' > src/utils/accesses.js;
  if [ "$1" == "start" ];
  then
    echo $ALL_ACCESSES | jq >> src/utils/accesses.js;
  else
    echo $ALL_ACCESSES >> src/utils/accesses.js;
  fi
  echo "SUCCESS";
else
  echo $ALL_ACCESSES;
fi