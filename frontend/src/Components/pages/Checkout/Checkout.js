import { useState, useEffect } from 'react';
import axios from "axios";
import {calDuration, FEE_INTERVAL} from "../../../utils/OrderUtils";
import { useHistory, useParams } from 'react-router';

export function Checkout() {

    var history = useHistory();
    const [quantity, setQuantity] = useState({});
    const [startTime, setStartTime] = useState(new Date().toLocaleDateString());
    const [endTime, setEndTime] = useState(new Date().toLocaleDateString());
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [parking, setParking] = useState(null);
    const [onlinePayment, setOnlinePayment] = useState(false);

    const USER_NAME = localStorage.getItem("userName");

    const {parkingId: PARKING_ID} = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8081/parkings/parking-searching?id=${PARKING_ID}`)
        .then(res => {
            console.log("okk");
            setParking(res.data);
            console.log(res.data);
        })
        .catch(err => {
            console.log("Get parking Fail");
            console.log(err);
        })
    }, [])

    useEffect(() => {
        if (endTime < startTime) {
            setEndTime(startTime);
        }
        console.log(quantity);
        console.log(parking)
    });

    function submitOrder() {
        // const TOTAL = price.map((item, idx) => item * quantity[idx])
        // .reduce((pre, cur) => pre + cur) * Math.ceil(calDuration(startTime, endTime) / FEE_INTERVAL);
        // if(TOTAL <= 0 || customerName == "" || phone == "") {
        //     alert("Incorrect or missing information, cannot checkout");
        //     return;
        // }

        axios.post("http://localhost:8081/orders/add-order", {

            name: customerName,
            phone: phone,
            email: email,

            paymentMethod: (onlinePayment ? "Thanh toán online" : "Thanh toán tại chỗ"),
            startTime: startTime.replace(/T/, ' ').replace(/Z/, '').replace(/\.(.)*/, ''),
            endTime: endTime.replace(/T/, ' ').replace(/Z/, '').replace(/\.(.)*/, ''),
            type: quantity,
            parking: PARKING_ID,
            customer: USER_NAME
        })
        .then(res => {
            alert("Order Successfully");
            history.goBack();
        })
        .catch(err => {
            alert(err);
        });
        // if(onlinePayment) {
        //     axios.post("/payment/process", {
        //         amount: (TOTAL / 23000).toFixed(1),
        //         description: [parking.name, customerName, phone].join(" | ")
        //     })
        //     .then(res => {
        //         window.open(res.data, "_blank");
        //     })
        //     .catch(err => {{
        //         alert(err);
        //     }})
        // }
    }

    if (parking == null) {
        return <></>
    }


    return(
        <div class="container px-5 py-3">
            <div class="row">
                <h3>Đặt bãi đỗ xe</h3>
            </div>
            <div class="row mt-4">
                <div class="col-2">
                    <img class="img-fluid" src={parking.img ? parking.img[0] : ""}/>
                </div>
                <div class="col-10 row">
                    <span class="col-6 fs-4 ">Tên bãi: {parking.name}</span>
                    <span class="col-6 fs-5">Địa chỉ: {[parking.address, parking.district, parking.province].join(", ")}</span>
                    <div class="col-6">
                        <label class="form-label fw-bold">Gửi vào lúc</label>
                        <input type="datetime-local" class="form-control" value={startTime} onChange={(event) => setStartTime(event.target.value)}/>
                    </div>
                    <div class="col-6">
                        <label type="text" class="form-label fw-bold">Lấy vào lúc</label>
                        <input type="datetime-local" class="form-control" onChange={(event) => setEndTime(event.target.value)}/>
                    </div>
                </div>
                <div class="col-12 row">
                    <div class="col-4">
                        <label class="form-label fw-bold">Họ và tên</label>
                        <input type="text" class="form-control" value={customerName} onChange={(event) => setCustomerName(event.target.value)}/>
                    </div>
                    <div class="col-4">
                        <label class="form-label fw-bold">Email</label>
                        <input type="text" class="form-control" value={email} onChange={(event) => setEmail(event.target.value)}/>
                    </div>
                    <div class="col-4">
                        <label class="form-label fw-bold">Số điện thoại</label>
                        <input type="text" class="form-control" value={phone} onChange={(event) => setPhone(event.target.value)}/>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <h4>Điều chỉnh số lượng xe</h4>
            </div>
            <div class="row">
                <table class="table w-75">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Loại xe</th>
                        <th scope="col">Số giờ thuê</th>
                        <th scope="col">Đơn giá/12h</th>
                        <th class="col-1" scope="col">Số lượng</th>
                        <th class="col-1" scope="col">Còn trống</th>
                        <th scope="col">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parking.type.map((vehicle, idx) => {
                            return(
                                <tr>
                                <th scope="row">{idx + 1}</th>
                                <td>{vehicle.name}</td>
                                <td>{Math.ceil(calDuration(startTime, endTime))}h</td>
                                <td>{Intl.NumberFormat().format(vehicle.price)}đ</td>
                                <td><input type="number" class="form-control" value={quantity[vehicle.name] ? quantity[vehicle.name] : 0} onChange={(event) => {
                                        setQuantity({...quantity, [vehicle.name]: event.target.value});
                                    }}/></td>
                                <td>{Intl.NumberFormat().format(vehicle.available)}</td>
                                <td>{Intl.NumberFormat().format(vehicle.price * (quantity[vehicle.name] ? quantity[vehicle.name] : 0) * Math.ceil(calDuration(startTime, endTime) / FEE_INTERVAL))}đ</td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td><h2>Tổng tiền</h2></td>
                            <td><h2 class="text-danger">{
                                Intl.NumberFormat().format(
                                parking.type.map((vehicle, idx) => vehicle.price * (quantity[vehicle.name] ? quantity[vehicle.name] : 0))
                                .reduce((pre, cur) => pre + cur) * Math.ceil(calDuration(startTime, endTime) / FEE_INTERVAL))
                            }đ</h2></td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
            <div>
                <h4>Hình thức thanh toán</h4>
                <div class="form-check">
                    <input class="form-check-input" type="radio" checked={!onlinePayment} onChange={() => setOnlinePayment(false)}/>
                    <label class="form-check-label text-secondary" >
                        Thanh toán tại chỗ
                    </label>
                    </div>
                    <div class="form-check">
                    <input class="form-check-input" type="radio" checked={onlinePayment} onChange={() => setOnlinePayment(true)}/>
                    <label class="form-check-label text-secondary">
                        Thanh toán online bằng Paypal
                    </label>
                </div>
            </div>
            <div class="row justify-content-center">
                <button class="btn btn-secondary col-2" onClick={submitOrder}>Đặt hàng/Hoàn tất</button>
            </div>
        </div>
    )
}