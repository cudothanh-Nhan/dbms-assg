import MiniCard from "./MiniCard";
import { useState, useEffect } from "react";
import axios from "axios";

export function FindByCity(props){
  


  const [theData, setProvince] = useState([]);


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

    return(
        <div class="pt-0">
            <div class="row row-cols-auto">
              {theData.length > 0 && theData.map((mini) => {
              return (
                <div class="col">
                  <div class="pt-3">
                    <MiniCard
                      id={mini.id}
                      name={mini.province}
                      number={mini.count}
                    ></MiniCard>
                  </div>
                </div>
              );
            })}
            </div>
        </div>
    )
}