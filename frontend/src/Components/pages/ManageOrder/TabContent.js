import { useState, useEffect } from "react";
import axios from 'axios'
import { Link } from 'react-router-dom';
import { removeVI, DefaultOption } from "jsrmvi";
import {calDuration,FEE_INTERVAL} from '../../../utils/OrderUtils';
import Button from '../../Button';
import './TabContent.css';

export const numOfOrder = (tabType, dataraw) => {
    var res = 0;
    dataraw?.map((ele) => {
        for (const order of ele[1]) {
            switch (tabType) {
                case 1:
                    if (order?.times[0] !== null && order?.times[1] == null && order?.times[4] == null) {
                        res++;
                    }
                    break;
                case 2:
                    if (order?.times[1] !== null && order?.times[2] == null && order?.times[4] == null) {
                        res++;
                    }
                    break;
                case 3:
                    if (order?.times[2] !== null && order?.times[3] == null && order?.times[4] == null) {
                        res++;
                    }
                    break;
                case 4:
                    if (order?.times[3] !== null && order?.times[4] == null) {
                        res++;
                    }
                    break;
                case 5:
                    if (order?.times[4] !== null) {
                        res++;
                    }
                    break;
                default:
                    res++;
                    break;
            }
        }
    });
    return res;
}

export function TabContent(props) {
    let tabType = props.tabType;
    let dataraw = props.orders;
    let getOrders = props.getOrders;
    let data = [];
    console.log(dataraw)
    dataraw?.map((ele) => {
        for (const order of ele[1]) {
            switch (tabType) {
                case 1:
                    if (order?.times[0] !== null && order?.times[1] == null && order?.times[4] == null) {
                        data.push([ele[0], order]);
                    }
                    break;
                case 2:
                    if (order?.times[1] !== null && order?.times[2] == null && order?.times[4] == null) {
                        data.push([ele[0], order]);
                    }
                    break;
                case 3:
                    if (order?.times[2] !== null && order?.times[3] == null && order?.times[4] == null) {
                        data.push([ele[0], order]);
                    }
                    break;
                case 4:
                    if (order?.times[3] !== null && order?.times[4] == null) {
                        data.push([ele[0], order]);
                    }
                    break;
                case 5:
                    if (order?.times[4] !== null) {
                        data.push([ele[0], order]);
                    }
                    break;
                default:
                    data.push([ele[0], order]);
                    break;
            }
        }
    });

    const [orders, setOrders] = useState(data);
    const [checkedOrder, setCheckOrder] = useState([]);
    const [pageOption, setPageOption] = useState('5 h??ng');
    const [filterOption, setFilterOption] = useState('M?? ????n h??ng');
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => { setOrders(data) }, [props]);

    // times[0]
    let checkNotAccept = (orderTime) => {
        var time = new Date(orderTime);
        time.setDate(time.getDate() + 1);
        var t = time.getTime() - new Date().getTime();
        var resT = t;
        var days, hours;
        var res;
        if (t <= 0) {
            t = -t;
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            t -= days * (1000 * 60 * 60 * 24);

            hours = Math.floor(t / (1000 * 60 * 60));

            res = "Tr??? x??c nh???n " + days + " ng??y " + hours + " gi???, t??? " + time.getHours() + "h" + time.getMinutes() + " "
                + time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
        }
        else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            t -= days * (1000 * 60 * 60 * 24);

            hours = Math.floor(t / (1000 * 60 * 60));

            res = "H???n x??c nh???n c??n " + days + " ng??y " + hours + " gi???, t??? " + time.getHours() + "h" + time.getMinutes() + " "
                + time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
        }
        return [res, resT];
    }

    // startTime
    let checkWaiting = (startTime) => {
        var time = new Date(startTime);
        // time.setHours(time.getHours() - 7);
        var t = time.getTime() - new Date().getTime();
        var resT = t;
        var days, hours;
        var res;
        if (t <= 0) {
            t = -t;
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            t -= days * (1000 * 60 * 60 * 24);

            hours = Math.floor(t / (1000 * 60 * 60));

            res = "???? tr??? " + days + " ng??y " + hours + " gi???, t??? " + time.getHours() + "h" + time.getMinutes() + " "
                + time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
        }
        else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            t -= days * (1000 * 60 * 60 * 24);

            hours = Math.floor(t / (1000 * 60 * 60));

            res = "Th???i gian ?????n l??c ????? l?? " + days + " ng??y " + hours + " gi???, t??? " + time.getHours() + "h" + time.getMinutes() + " "
                + time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
        }
        return [res, resT];
    }

    // endTime
    let checkParking = (endTime) => {
        var time = new Date(endTime);
        // time.setHours(time.getHours() - 7);
        var t = time.getTime() - new Date().getTime();
        var resT = t;
        var days, hours;
        var res;
        if (t <= 0) {
            t = -t;
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            t -= days * (1000 * 60 * 60 * 24);

            hours = Math.floor(t / (1000 * 60 * 60));

            res = "Qu?? h???n l???y xe " + days + " ng??y " + hours + " gi???, t??? " + time.getHours() + "h" + time.getMinutes() + " "
                + time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
        }
        else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            t -= days * (1000 * 60 * 60 * 24);

            hours = Math.floor(t / (1000 * 60 * 60));

            res = "Th???i gian ????? c??n " + days + " ng??y " + hours + " gi???, ?????n " + time.getHours() + "h" + time.getMinutes() + " "
            + time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
        }
        return [res,resT];
    }

    // times[3]
    let checkDone = (doneTime) => {
        var time = new Date(doneTime);
        // time.setHours(time.getHours() - 7);
        return "???? ho??n t???t v??o "+ time.getHours() + "h" + time.getMinutes() + " "
        + time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
    }

    // times[4]
    let checkCancel = (cancelTime) => {
        var time = new Date(cancelTime);
        // time.setHours(time.getHours() - 7);
        return "???? h???y ????n v??o "+ time.getHours() + "h" + time.getMinutes() + " "
        + time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
    }

    let checkTime = (order) => {
        switch (tabType) {
            case 1:
                return checkNotAccept(order?.times[0])[0];
            case 2:
                return checkWaiting(order?.startTime)[0];
            case 3:
                return checkParking(order?.endTime)[0];
            case 4:
                return checkDone(order?.times[3]);
            case 5:
                return checkCancel(order?.times[4]);
            default:
                if(order?.times[4] !== null){
                    return checkCancel(order?.times[4]);
                }
                else if(order?.times[3] !== null){
                    return checkDone(order?.times[3]);
                }
                else if(order?.times[2] !== null){
                    return checkParking(order?.endTime)[0];
                }
                else if(order?.times[1] !== null){
                    return checkWaiting(order?.startTime)[0];
                }
                else if(order?.times[0] !== null){
                    return checkNotAccept(order?.times[0])[0];
                }
        }
    }

    let classN = (order) => {
        var t;
        switch (tabType) {
            case 1:
                t = checkNotAccept(order?.times[0])[1];
                break;
            case 2:
                t = checkWaiting(order?.startTime)[1];
                break;
            case 3:
                t = checkParking(order?.endTime)[1];
                break;
            case 4:
                return "time-done";
            case 5:
                return "time-cancel";
            default:
                if(order?.times[4] !== null){
                    return "time-cancel";
                }
                else if(order?.times[3] !== null){
                    return "time-done";
                }
                else if(order?.times[2] !== null){
                    t = checkParking(order?.endTime)[1];
                }
                else if(order?.times[1] !== null){
                    t = checkWaiting(order?.startTime)[1];
                }
                else if(order?.times[0] !== null){
                    t = checkNotAccept(order?.times[0])[1];
                }
                break;
        }
        return (t >= 0) ? "time-left" : "time-late";
    }

    let displayInfo = (vehicles, option) => {
        const type = ['Xe m??y', 'Xe 4-7 ch???', 'Xe 9-16 ch???', 'Xe 32 ch???'];
        console.log(vehicles);
        return vehicles?.map((ele, index) => {

            if (option === 'html')
                return (<p>{ele.name}: {ele.quantity}</p>);
            else if (option === 'text') return `${ele.name}: ${ele.quantity}`;
            

        });
    }

    let totalPrice = (vehicles, time) => {
        var sum = 0;
        vehicles?.map((ele, index) => {
            sum += ele.unitPrice * ele.quantity * time;
        })
        return sum;
    }

    let handleCheckbox = (checked, order) => {
        if (checked) {
            setCheckOrder((prev) => [...prev, order]);
        }
        else {
            setCheckOrder(checkedOrder.filter(item => item !== order));
        }
    }

    let filterRow = (orders, filterOption, filterValue) => {
        if (filterValue === '')
            return orders;
        else {
            filterValue = removeVI(filterValue, { replaceSpecialCharacters: false })?.replace(/\s/g, '');
            let res = [];
            orders?.map((order) => {
                switch (filterOption) {
                    case 'M?? ????n h??ng':
                        if (('#' + order[1]?._id?.replace(/\s/g, '').toLowerCase()).search(filterValue) >= 0) res.push(order);
                        break;
                    case 'T??n b??i ?????':
                        var text = removeVI(order[0], { replaceSpecialCharacters: false });
                        if (text.replace(/\s/g, '').search(filterValue) >= 0) res.push(order);
                        break;
                    case 'H???n x??? l??':
                        var text = removeVI(checkTime(order[1]), { replaceSpecialCharacters: false });
                        if (text.replace(/\s/g, '').search(filterValue) >= 0) res.push(order);
                        break;
                    case 'Th??ng tin':
                        var t;
                        for (const i of displayInfo(order[1]?.vehicles, 'text')) {
                            t += i;
                        }
                        var text = removeVI(t, { replaceSpecialCharacters: false });
                        if (text.replace(/\s/g, '').search(filterValue) >= 0) res.push(order);
                        break;
                    case 'T???ng ti???n':
                        var text = removeVI(totalPrice(order[1]?.price, order[1]?.quantity, Math.ceil(calDuration(order[1]?.startTime, order[1]?.endTime) / FEE_INTERVAL)).toString(), { replaceSpecialCharacters: false });
                        if (text.replace(/\s/g, '').search(filterValue) >= 0) res.push(order);
                        break;
                }
            });
            return res;
        }
    }

    let RenderRows = function (orders, pageOption, filterOption, filterValue) {
        orders = filterRow(orders, filterOption, filterValue);
        return orders?.map((order, index) => {
            switch (pageOption) {
                case '5 h??ng':
                    if (index >= 5) return '';
                case '10 h??ng':
                    if (index >= 10) return '';
                case 'T???t c???':
                    return (
                        <tr>
                            <td><input name={tabType} class="form-check form-check-input" type="checkbox" onChange={(e) => handleCheckbox(e.target.checked, order[1])} /></td>
                            <td><Link className="text-decoration-none" to={'/account/order-info/' + order[1]?._id}>#{order[1]?._id}</Link></td>
                            <td className="park-name">{order[0]}</td>
                            <td className={classN(order[1])}>
                                {checkTime(order[1])}
                            </td>
                            <td>{displayInfo(order[1]?.vehicles, 'html')}</td>
                            <td className="total-money">{Intl.NumberFormat().format(totalPrice(order[1]?.vehicles, Math.ceil(calDuration(order[1]?.startTime, order[1]?.endTime) / FEE_INTERVAL)))} VN??</td>
                        </tr>
                    );
            }
        });
    }

    let clearCheckbox = () => {
        var x = document.getElementsByName(tabType);
        for (let e of x) {
            e.checked = false;
        }
        setCheckOrder([]);
    }

    let setNewStatus = (order) => {
        let res = order?.times;
        for (var i = 0; i < 4; i++) {
            if (!res[i]) {
                res[i] = new Date();
                break;
            }
        }
        return res;
    }

    let accept = async () => {
        let arr = JSON.parse(JSON.stringify(checkedOrder));
        for (let order of arr) {
            let newStt = setNewStatus(order);
            await axios.post(`http://localhost:8081/orders/change-state/${order?._id}`,{
                cmd: 'update'
            });
        }
        clearCheckbox();
        getOrders();
        console.log(checkedOrder);
    }

    let cancelOrder = (order) => {
        let res = order?.times;
        if(!res[4]){
            res[4] = new Date();
            return res;
        }
        return '';
    }

    let cancel = () => {
        let arr = JSON.parse(JSON.stringify(checkedOrder));
        for (let order of arr) {
            let newStt = cancelOrder(order);
            if(newStt==='') continue;
            axios.put(`/order/change-state/${order?._id}`, newStt);
        }
        clearCheckbox();
        getOrders();
    }

    return (
        <>
            <div style={{ display: 'flex' }}>
                <label for="formGroupExampleInput" class="form-label">Hi???n th???</label>
                <select class="form-select" aria-label="Default select example" onChange={(e) => setPageOption(e.target.value)}>
                    <option value="5 h??ng">5 h??ng</option>
                    <option value="10 h??ng">10 h??ng</option>
                    <option value="T???t c???">T???t c???</option>
                </select>
                <label for="formGroupExampleInput" class="form-label">L???c theo</label>
                <select class="form-select" aria-label="Default select example" onChange={(e) => setFilterOption(e.target.value)}>
                    <option value='M?? ????n h??ng'>M?? ????n h??ng</option>
                    <option value='T??n b??i ?????'>T??n b??i ?????</option>
                    <option value='H???n x??? l??'>H???n x??? l??</option>
                    <option value='Th??ng tin'>Th??ng tin</option>
                    <option value='T???ng ti???n'>T???ng ti???n</option>
                </select>
                <input type="text" class="form-control order-search" id="formGroupExampleInput"
                    placeholder="T??m ki???m ????n h??ng" onChange={(e) => setFilterValue(e.target.value)} />
            </div>
            <div style={{ display: 'flex', float: 'right' }}>
                <div style={props.tabType >= 4 ? { display: "none" } : {}} className="btn-order" ><Button bgcolor="#ffd53b" btnName="X??? l?? ????n h??ng" onClick={accept} /></div>
                <div style={props.tabType == 5 ? { display: "none" } : {}} className="btn-order"><Button bgcolor="#211931" btnName="H???y ????n h??ng" onClick={cancel} /></div>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Ch???n</th>
                        <th scope="col">M?? ????n h??ng</th>
                        <th scope="col">T??n b??i ?????</th>
                        <th scope="col">H???n x??? l??</th>
                        <th scope="col">Th??ng tin</th>
                        <th scope="col">T???ng ti???n</th>
                    </tr>
                </thead>
                <tbody>
                    {RenderRows(orders, pageOption, filterOption, filterValue)}
                </tbody>
            </table>
        </>
    );
}