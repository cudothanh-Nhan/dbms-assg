


function typere(idx) {
  if (idx === 0) return "Xe máy";
  else if (idx === 1) return " Xe ô tô 4-7 chỗ";
  else if (idx === 2) return "Xe 9-16 chỗ";
  else if (idx === 3) return "Xe 32 chỗ";
}
export function CostTable({param}) {
  return (
    <table class="table border">
      <thead>
        <tr class="table-dark">
          <th scope="col">Loại xe</th>
          <th scope="col">Giá gửi /12h / VNĐ</th>
          <th scope="col">Tổng chỗ</th>
          <th scope="col">Còn trống</th>
        </tr>
      </thead>
      <tbody>
       
      
       {param.map((each, index) => {
        return (
          <tr>
            <td>{each.name}</td>
            <td>{Intl.NumberFormat().format(each.price)}</td>
            <td>{Intl.NumberFormat().format(each.capacity)}</td>
            <td>{Intl.NumberFormat().format(each.available)}</td>
          </tr>
        );
      })} 
      </tbody>
    </table>
  );
}
