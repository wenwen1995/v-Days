
//转化记录的数据
export function translatorRecordList(list){
  return list.map((item) => {
          item.setTimeStamp = new Date(item.setTimeStamp).getTime();
          return item;
  });
}