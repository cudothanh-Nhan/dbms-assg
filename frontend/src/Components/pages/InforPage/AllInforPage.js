import React, { useState } from "react";

import { InforPage } from "./InforPage";
import axios from 'axios'
class AllInforPage extends React.Component {

  state = {
    parks : [
       {
       _id: String,
       name: String,
       street: String,
       ward : String,
       district: String,
       province: String,
       long: Number,
       lat: Number,
       description: String,
       img: Array,
       price: Array,
       userName: String,
       feedback: [
         {
           userName: String,
           content: String,
           time: Date,
           rate: Number

         }
       ]


       }
 
     ]
   }
   constructor(props) {
     super(props);
     this.state = {
         parks: []
     };
 }
        render(){
          return(
              <InforPage></InforPage>
          )
        }
           
}

      

export default AllInforPage