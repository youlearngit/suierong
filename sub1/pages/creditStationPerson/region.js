import api from '../../../utils/api';
/**
 * 原生picker的数据格式格式
 */
export async function getRegionCode(regionCode) {
  let arr = [[], [], []]; // 地区选择组件的数据结构
  let provinceCode = regionCode.substring(0, 2);
  let cityCode = getCityCode(regionCode.substring(0, 4));
  let adCodeList = await api.getDistarct('100000', '3');

  let provice = adCodeList.districts[0].districts.find((e) => e.adcode === `${provinceCode}0000`);
  arr[0].push(provice);
  let city = provice.districts.find((e) => e.adcode === `${cityCode}00`);
  if (!city) {
    arr[1].push.apply(arr[1], provice.districts);
    arr[2].push.apply(arr[2], provice.districts[0].districts);
    return arr;
  }
  arr[1].push(city);
  arr[2].push.apply(arr[2], city.districts);
  return arr;
}
/**
 * 
 * @param {*} regionCode 
 * @returns vant pciker数据格式
 */
export async function getRegionCode2(regionCode) {
  console.log(regionCode);
  let arr = []; 
  let provinceCode = regionCode.substring(0, 2);
  let cityCode = getCityCode(regionCode.substring(0, 4));
  //查询所有列表
  let adCodeList = await api.getDistarct('100000', '3');
  //
  let provice = adCodeList.districts[0].districts.find((e) => e.adcode === `${provinceCode}0000`);

  if (!provice) {
    let proviceList = ['11', '32', '44', '33', '31']; // provice limie
    provice = adCodeList.districts[0].districts.filter((e) => proviceList.includes(e.adcode.substring(0, 2)));
    // city limit 
    provice.forEach((e) => {
      let adcode = e.adcode;
      if (adcode === '440000' || adcode === '330000') {
        e.districts = e.districts.filter((e) => e.adcode === '330100' || e.adcode === '440300');
      }
    });

    arr.push({
      values: provice,
    });

    arr.push({
      values: provice[0].districts,
    });

    arr.push({
      values: provice[0].districts[0].districts,
    });

  } else {
    arr.push({
      values: [provice],
    });
    let city = provice.districts.find((e) => e.adcode === `${cityCode}00`);
    if (!city) {
      arr.push({
        values: provice.districts,
      });
      arr.push({
        values: provice.districts[0].districts,
      });
      return arr;
    }
    arr.push({
      values: [city],
    });
    arr.push({
      values: city.districts,
    });
  }

  return arr;
}


/**
 *
 * @param {*} 返回所有地区 第一列为查询到的地区
 * @returns vant pciker数据格式
 */
 export async function getRegionCode3(regionCode) {
    console.log(regionCode);
    let arr = [];
    let provinceCode = regionCode.substring(0, 2);
    let cityCode = getCityCode(regionCode.substring(0, 4));
    //查询所有列表
    let adCodeList = await api.getDistarct('100000', '3');
    //
    let provice = adCodeList.districts[0].districts.find((e) => e.adcode === `${provinceCode}0000`);
  
    let allProvince = adCodeList.districts[0].districts.filter((e) =>
      ['11', '32', '44', '33', '31'].includes(e.adcode.substring(0, 2)),
    );
  
    if (!provice) {
      let proviceList = ['11', '32', '44', '33', '31']; // provice limie
      provice = adCodeList.districts[0].districts.filter((e) => proviceList.includes(e.adcode.substring(0, 2)));
      // city limit
      provice.forEach((e) => {
        let adcode = e.adcode;
        if (adcode === '440000' || adcode === '330000') {
          e.districts = e.districts.filter((e) => e.adcode === '330100' || e.adcode === '440300');
        }
      });
  
      arr.push({
        values: provice,
      });
  
      arr.push({
        values: provice[0].districts,
      });
  
      arr.push({
        values: provice[0].districts[0].districts,
      });
    } else {
      for (let i = 0; i < allProvince.length; i++) {
        if (allProvince[i].adcode === provice.adcode) {
          let temp = allProvince[0];
          allProvince[0] = allProvince[i];
          allProvince[i] = temp;
          break;
        }
      }
      
      arr.push({
        values: allProvince,
      });
      let city = provice.districts.find((e) => e.adcode === `${cityCode}00`);
      if (!city) {
        arr.push({
          values: provice.districts,
        });
        arr.push({
          values: provice.districts[0].districts,
        });
        return arr;
      }
      arr.push({
        values: [city],
      });
      arr.push({
        values: city.districts,
      });
    }
  
    return arr;
  }
  

function getCityCode(cityID) {
  switch (cityID) {
    case '3305':
    case '3306':
    case '3300':
      cityID = '3301';
      break;
    case '4400':
      cityID = '4403';
      break;
    case /^310/.test(cityID):
      cityID = '3101';
      break;
    case /^110/.test(cityID):
      cityID = '1101';
      break;
    default:
      break;
  }
  return cityID;
}
