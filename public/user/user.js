const body = document.getElementById("tab_voti");

const tableHeader = `
  <tr class="table-primary">
    <th class="text-center">STUDENTE</th> 
    <th class="text-center">Italiano</th> 
    <th class="text-center">TPS</th>
    <th class="text-center">Matematica</th>
    <th class="text-center">Informatica</th>
    <th class="text-center">GPOI</th>
  </tr> 
`;

const template = `
  <tr>
    <td class="text-center">%STUDENTE</td> 
    <td class="text-center">%VOTO1</td> 
    <td class="text-center">%VOTO2</td>
    <td class="text-center">%VOTO3</td>
    <td class="text-center">%VOTO4</td>
    <td class="text-center">%VOTO5</td>
  </tr>
`;

const renderTab = () => {
    let html = tableHeader;
    //for (let i = 0; i < json.length; i++) {
      let rowHtml = template.replace("%STUDENTE", "mirko");
      rowHtml = rowHtml.replace("%VOTO1", "8");
      rowHtml = rowHtml.replace("%VOTO2", "10");
      rowHtml = rowHtml.replace("%VOTO3", "7");
      rowHtml = rowHtml.replace("%VOTO4", "6");
      rowHtml = rowHtml.replace("%VOTO5", "8");
  
      html += rowHtml;
    //}
    body.innerHTML = html;
};

renderTab();
