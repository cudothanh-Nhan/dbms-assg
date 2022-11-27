import CityCard from "./CityCard";
import UserGuide from "./UserGuide";
import OptionButtonGroup from "./OptionButtonGroup";
import SearchingCard from "../Searching/SearchingCard";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { removeVI } from "jsrmvi";
const USER_GUIDE = [
  [
    "https://thumbs.dreamstime.com/b/connected-car-parking-sharing-service-remote-controlled-via-smartphone-app-vector-illustration-autonomous-wireless-hands-154583213.jpg",
    "Cách đặt chỗ gửi xe trên EasyParking",
  ],
  [
    "https://media.istockphoto.com/vectors/tiny-people-park-ar-in-parking-area-parking-lot-public-carpark-in-big-vector-id1331615197?b=1&k=20&m=1331615197&s=170667a&w=0&h=ESTSiNzlvpMQqP_WIAlmUTiSR_3kWJZbJYIN2PJIRGQ=",
    "Cách đăng tin bãi đỗ xe trên EasyParking",
  ],
  [
    "https://thumbs.dreamstime.com/b/connected-car-parking-sharing-service-remote-controlled-via-smartphone-app-vector-illustration-autonomous-wireless-hands-154583213.jpg",
    "Cổng thanh toán trực tuyến",
  ],
  [
    "https://thumbs.dreamstime.com/b/connected-car-parking-sharing-service-remote-controlled-via-smartphone-app-vector-illustration-autonomous-wireless-hands-154583213.jpg",
    "Những câu hỏi thường gặp",
  ],
];

const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
export function NewfeedPage() {
  const [theData, setProvince] = useState([]);
  const [DataParkingOustandingfour, setOutStanding] = useState([]);
  
  

  function GetType(value){
    return value.type.map(t => t.name).join(', ');
  }
  function getImg(value) {
    const imgs = [
      "https://media.vneconomy.vn/images/upload/2021/09/15/tphcm.jpg",
      "https://photo-cms-vovworld.zadn.vn/w500/Uploaded/vovworld/yzfsm/2019_09_23/vungtau_MWEG.jpg",
      "https://www.vietnambooking.com/wp-content/uploads/2020/12/kinh-nghiem-di-da-lat-thang-12-1.jpg",
      "https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/04_2019/khanh-hoa.jpg"
    ]
    return imgs[value]
  }
  function getNumCity(value) {
    let count = 0;
    for (let i in theData) {
      if (theData[i].province == value) {
        count = theData[i].count;
      }
    }
    return count;
  }

  useEffect(() => {
    axios
      .get("http://localhost:8081/parkings/summary")
      .then((res) => {
        if (res.status == 200) {
          setProvince(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);


  useEffect(() => {
    axios
      .get("http://localhost:8081/parkings/popular")
      .then((res) => {
        if (res.status == 200) {
          setOutStanding(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  function uniq(a) {
    return a.sort().filter(function (item, pos, ary) {
      return !pos || item !== ary[pos - 1];
    });
  }

  var DataProvince = [];
  for (let i in theData) {
    DataProvince.push(theData[i]);
  }
  

  var DataProvincefour = DataProvince.slice(0,4);
  // var DataParkingOustanding = theData.filter((each)=>{
  //   return average(each.feedback.map((e)=>{
  //         return e.rate
  //   })) >= 4
  // })
  // var DataParkingOustandingfour = DataParkingOustanding.slice(0,4);
  // var addressList = [];
  // for (let i in theData){
  //   addressList.push(theData[i].street + " " + theData[i].ward + " " + theData[i].district + " " + theData[i].province)
  // }
  
  return (
    <div>
      <div class="pt-5 ps-5">
        <div class="col pt-30">
          <h2 class="PlaceName text-center">
            Chào mừng đến với <span class="text-primary">EasyParking</span>
          </h2>
          <h3 class="PlaceName text-center">
            Đặt chỗ gửi xe nhanh chóng, tiện lợi, thanh toán dễ dàng
          </h3>
          <h3 class="PlaceName text-center">
          <NavLink to="/login" class="text-primary">
              Đăng nhập
            </NavLink>{" "}
            hoặc{" "}
            <NavLink to="/SignUp" class="text-primary">
              Đăng ký
            </NavLink>{" "}
            để trải nghiệm
          </h3>
          <h4 class="PlaceName pt-4">Địa điểm nổi bật</h4>
          <div class="pt-0">
            <div class="row pe-5">
              {DataProvincefour.map((city, idx) => {
                return (
                  <div class="col-sm-3">
                    <div class="pt-3">
                    
                      <CityCard
                        id = {city.id}
                        img={getImg(idx)}
                        name={city.province}
                        number={city.count}
                      ></CityCard>
                    
                    </div>
                  </div>
                );
              })}
            </div>
            <h4 class="PlaceName pt-4">Hướng dẫn sử dụng</h4>
            <div class="pt-0">
              <div class="row pe-5">
                {USER_GUIDE.map((guide) => {
                  return (
                    <div class="col-sm-3">
                      <div class="pt-3">
                        <UserGuide img={guide[0]} text={guide[1]}></UserGuide>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <h4 class="PlaceName pt-4">Tìm kiếm theo địa điểm</h4>
            <div class="pt-4">
              <OptionButtonGroup></OptionButtonGroup>
            </div>
            <h4 class="PlaceName pt-4">Nổi bật</h4>
            <div class="pt-0">
              <div class="row pe-5">
                {DataParkingOustandingfour.map((parking) => {
                  return (
                    <div class="col-sm-3">
                      <div class="pt-3 pe-3">
                        <SearchingCard
                          id = {parking._id}
                          name={parking.name}
                          src={parking.img[0]}
                          star={parking.rate}
                          numEvaluate={parking.nFeedback}
                          address={parking.ward+', '+parking.district+', '+parking.province}
                          type={GetType(parking)}
                        ></SearchingCard>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
