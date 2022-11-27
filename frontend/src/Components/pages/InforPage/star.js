import React, {useState} from 'react';   

export function StarRate({count, value, 
    inactiveColor= '#f1f1e8',
    
    activeColor='rgba(255, 213, 59, 1)', onChange}) {

  // short trick 
  const stars = Array.from({length: count}, () => '🟊')

  // Internal handle change function
  const handleChange = (value) => {
    onChange(value + 1);
  }

  return (
    <div>
      {stars.map((s, index) => {
        let style = inactiveColor;
        if (index < value) {
          style=activeColor;
        }
        return (
          <svg onClick={()=>handleChange(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={index < value ? "#ffd53b": '#f1f1e8'} class="bi bi-star-fill m-2" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
          // <span className={"star"}  
          //   key={index}
          //   style={{color: style, width:25, height:25, fontSize: 25}}
          //   onClick={()=>handleChange(index)}>{s}</span>
        )
      })}
      
    </div>
  )
}
