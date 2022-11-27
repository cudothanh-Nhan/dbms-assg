import "./InforPage.css";
import { CostTable } from "./CostTable";
import  ListReview  from "./ListReview";
import { NavLink } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import { useParams } from "react-router";
import InfoModal from './MapPopup';
import { useEffect, useState } from "react";
import axios from "axios";

export function InforPage() {
  let { id } = useParams();
  const [parking, setParking] = useState(null);
  useEffect(() => {
    axios.get(`http://localhost:8081/parkings/parking-searching?id=${id}`).then((res) => {
      if (res.status == 200) {
        setParking(res.data);
        console.log(res.data);
      }
    }).catch(err => console.log(err));
  }, [])

  if (parking == null) {
    return (<div/>)
  }

  return (
    <div class="h-100">
      <div class="row h-100">
        <div class="pt-3 ps-5 pe-5">
          <div class="row ">
            <div class="col-auto me-auto">
              <h3>{parking.name}</h3>
            </div>
            <div class="col-auto">
            <NavLink to={"/checkout/" + id} class="btn datngay">
                Đặt ngay
              </NavLink>
            </div>
          </div>
          <div class="row ">
            <div class="col-auto pt-2">
              <div class="font4">
                {parking.address+
                  ", " +
                  parking.district +
                  ", " +
                  parking.province}
              </div>
            </div>
            <div class="col">
              <div class="row ">
                {/* <a class="nav-link" href="">
                  Xem trên bản đồ ->{" "}
                </a> */}
                <InfoModal name={parking.name} address={parking.address +parking.district+', ' + parking.province}/>
              </div>
            </div>
          </div>
          <div class="pt-4">
            <ImageSlider slides={parking.img} />
          </div>
          <div class="row pt-5">
            <h4>Giới thiệu</h4>
          </div>
          <div class="row pt-3">
            <div class="col-sm-7 ">
              <div class="font4">
                <div className="new-line">{parking.description}</div>
              </div>
            </div>
            <div class="col-4 ps-5">
              <CostTable param={parking.type} />
            </div>
          </div>
          <div class="col">
            <div class="Container">
              <ListReview data={parking.feedback} id={id}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
