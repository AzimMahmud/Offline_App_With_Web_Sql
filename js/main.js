const db = openDatabase(
  "ticketBookingDB",
  "1.0.0",
  "Ticket Booking Offline App",
  2 * 1024 * 1024
);

db.transaction(tx => {
  tx.executeSql(
    "Create Table If Not Exists TicketBooking (id integer primary key autoincrement, name, email, airlines, mealList, ticketClass, leavingFrom, goingTo)"
  );
});

document.querySelector("#airlines").addEventListener("change", () => {
  let leavForm = document.querySelector("#leavingFrom");
  let goingTo = document.querySelector("#goingTo");
  let airLines = document.querySelector("#airlines");
  leavForm.innerHTML = "";
  goingTo.innerHTML = "";
  var routes;
  if (airLines.value === "US-Bangla") {
    routes = ["Chittagong|Chittagong", "Dhaka|Dhaka"];
  } else if (airLines.value === "Regent Airways") {
    routes = ["Chittagong|Chittagong", "Borisal|Borisal", "Bogura|Bogura"];
  } else if (airLines.value === "Novoair") {
    routes = ["Dhaka|Dhaka", "Rangpur|Rangpur", "Bogura|Bogura"];
  } else if (airLines.value === "Biman Bangladesh") {
    routes = ["Dhaka|Dhaka", "Rangpur|Rangpur", "Cox-Bazar|Cox-Bazar"];
  } else {
    routes = ["None|None"];
  }
  console.log(routes);

  for (const route in routes) {
    let routeLines = routes[route].split("|");
    let newOption = document.createElement("option");
    newOption.value = routeLines[0];
    newOption.textContent = routeLines[1];
    leavForm.appendChild(newOption);
  }

  for (const route in routes) {
    let routeLines = routes[route].split("|");
    let newOption = document.createElement("option");
    newOption.value = routeLines[0];
    newOption.textContent = routeLines[1];
    goingTo.appendChild(newOption);
  }
});

document.querySelector("#btnSubmit").addEventListener("click", () => {
  let userTitle = document.querySelector("#title").value;
  let userFirstName = document.querySelector("#fName").value;
  let userLastName = document.querySelector("#lName").value;
  let userEmail = document.querySelector("#email").value;
  let airlines = document.querySelector("#airlines").value;
  let ticketClass = document.querySelector('input[name="ticketClass"]:checked')
    .value;

  let mealList = document.getElementsByName("mealList");

  let leavingFrom = document.querySelector("#leavingFrom").value;
  let goingTo = document.querySelector("#goingTo").value;

  let userMeal = new Array();
  for (let i = 0; i < mealList.length; i++) {
    if (mealList[i].checked === true) {
      userMeal.push(mealList[i].value);
    }
  }

  let userMealList = userMeal.join(",");

  // if (!userFirstName) {
  //   document.querySelector("#fName").classList.add("error");
  // } else if (!userEmail) {
  //   document.querySelector("#email").classList.add("error");
  // } else if (!airlines) {
  //   document.querySelector("#airlines").classList.add("error");
  // } else if (!leavingFrom) {
  //   document.querySelector("#leavingFrom").classList.add("error");
  // } else
  if (!goingTo) {
    document.querySelector("#goingTo").classList.add("error");
  } else {
    let name = userTitle + " " + userFirstName + " " + userLastName;

    db.transaction(tx => {
      tx.executeSql(
        "Insert Into TicketBooking ( name, email, airlines, ticketClass, mealList, leavingFrom, goingTo) Values (?,?,?,?,?,?,?)",
        [
          name,
          userEmail,
          airlines,
          ticketClass,
          userMealList,
          leavingFrom,
          goingTo
        ],
        (tx, result) => {
          let id = result.insertId;

          let tableRow = document.createElement("tr");
          let uId = document.createElement("td");
          let uName = document.createElement("td");
          let uEmail = document.createElement("td");
          let airLines = document.createElement("td");
          let uTicClass = document.createElement("td");
          let uMealList = document.createElement("td");
          let uLeavingFrom = document.createElement("td");
          let uGongTo = document.createElement("td");
          let controls = document.createElement("td");

          uId.textContent = id;
          uName.textContent = name;
          uEmail.textContent = userEmail;
          airLines.textContent = airlines;
          uTicClass.textContent = ticketClass;
          uMealList.textContent = userMealList;
          uLeavingFrom.textContent = leavingFrom;
          uGongTo.textContent = goingTo;
          controls.innerHTML =
            '<button onclick="editInfo(' +
            id +
            ')">Edit</button>' +
            '<button onclick="deleteInfo(' +
            id +
            ')">Delete</button>';

          tableRow.setAttribute("id", "tic" + id);
          tableRow.appendChild(uId);
          tableRow.appendChild(uName);
          tableRow.appendChild(uEmail);
          tableRow.appendChild(airLines);
          tableRow.appendChild(uTicClass);
          tableRow.appendChild(uMealList);
          tableRow.appendChild(uLeavingFrom);
          tableRow.appendChild(uGongTo);
          tableRow.appendChild(controls);

          document.querySelector("#ticketInfo tbody").appendChild(tableRow);
        }
      );
    });
  }
});

function editInfo(id) {
  document.getElementById("main-form").reset();
  db.transaction(tx => {
    tx.executeSql(
      "Select * From TicketBooking Where id = ? ",
      [id],
      (tx, results) => {
        let data = results.rows.item(0);

        let name = data.name.split(" ");
        let title = name[0];
        let fName = name[1];
        let lName = name[2];

        let meals = data.mealList.split(",");

        let btnUpdate;
        if (document.querySelector("#controlsBtn #btnSubmit")) {
          document.querySelector("#controlsBtn #btnSubmit").remove();
          btnUpdate = document.createElement("button");
          btnUpdate.setAttribute("onclick", "upInfo()");
          btnUpdate.textContent = "Update";
          document.querySelector("#controlsBtn").appendChild(btnUpdate);
        }
        document.querySelector("#id").value = data.id;
        document.querySelector("#title").value = title;
        document.querySelector("#fName").value = fName;
        document.querySelector("#lName").value = lName;
        document.querySelector("#email").value = data.email;

        let airLine = document.querySelector("#airlines");

        for (let i = 0; i < airLine.length; i++) {
          if (airLine[i].value === data.airlines) {
            airLine[i].selected = true;
          } else {
            airLine[i].selected = false;
          }
        }

        let ticCLassList = document.getElementsByName("ticketClass");
        for (let i = 0; i < ticCLassList.length; i++) {
          if (ticCLassList[i].value === data.ticketClass) {
            ticCLassList[i].checked = true;
          } else {
            ticCLassList[i].checked = false;
          }
        }

        let mealLists = document.getElementsByName("mealList");

        for (let i = 0; i < mealLists.length; i++) {
          for (let j = 0; j < meals.length; j++) {
            if (mealLists[i].value === meals[j]) {
              console.log("call");
              mealLists[i].checked = true;
            } else {
              console.log("continue");
              continue;
            }
          }
        }
        document.querySelector("#leavingFrom").value = data.leavingFrom;
        document.querySelector("#goingTo").value = data.goingTo;
      }
    );
  });
}

function upInfo() {
  let id = document.querySelector("#main-form #id").value;
  let userTitle = document.querySelector("#main-form #title").value;
  let userFirstName = document.querySelector("#main-form #fName").value;
  let userLastName = document.querySelector("#main-form #lName").value;
  let userEmail = document.querySelector("#main-form #email").value;
  let airlines = document.querySelector("#main-form #airlines").value;
  let ticketClass = document.querySelector('input[name="ticketClass"]:checked')
    .value;
  let leavingFrom = document.querySelector("#main-form #leavingFrom").value;
  let goingTo = document.querySelector("#main-form #goingTo").value;

  if (!userFirstName) {
    document.querySelector("#fName").classList.add("error");
  } else if (!userEmail) {
    document.querySelector("#email").classList.add("error");
  } else if (!airlines) {
    document.querySelector("#airlines").classList.add("error");
  } else if (!leavingFrom) {
    document.querySelector("#leavingFrom").classList.add("error");
  } else if (!goingTo) {
    document.querySelector("#goingTo").classList.add("error");
  } else {
    let name = userTitle + " " + userFirstName + " " + userLastName;

    db.transaction(tx => {
      tx.executeSql(
        "Update TicketBooking Set name = ?, email = ?, airlines = ?, ticketClass = ?, leavingFrom = ?, goingTo = ? Where id = ?",
        [name, userEmail, airlines, ticketClass, leavingFrom, goingTo, id]
      );
    });
  }
}

function deleteInfo(id) {
  db.transaction(tx => {
    tx.executeSql("Delete From TicketBooking Where id = ?", [id]);

    let table = document.querySelector("#ticketInfo tbody");
    let row = document.querySelector("#tic" + id);
    table.removeChild(row);
  });
}

window.onload = function() {
  db.transaction(tx => {
    tx.executeSql("Select * From TicketBooking", [], (tx, data) => {
      let dataLength = data.rows.length;

      for (let i = 0; i < dataLength; i++) {
        let tableRow = document.createElement("tr");
        let uId = document.createElement("td");
        let uName = document.createElement("td");
        let uEmail = document.createElement("td");
        let airLines = document.createElement("td");
        let uTicClass = document.createElement("td");
        let uMealList = document.createElement("td");
        let uLeavingFrom = document.createElement("td");
        let uGongTo = document.createElement("td");
        let controls = document.createElement("td");

        uId.textContent = data.rows.item(i).id;
        uName.textContent = data.rows.item(i).name;
        uEmail.textContent = data.rows.item(i).email;
        airLines.textContent = data.rows.item(i).airlines;
        uTicClass.textContent = data.rows.item(i).ticketClass;
        uMealList.textContent = data.rows.item(i).mealList;
        uLeavingFrom.textContent = data.rows.item(i).leavingFrom;
        uGongTo.textContent = data.rows.item(i).goingTo;
        controls.innerHTML =
          '<button onclick="editInfo(' +
          data.rows.item(i).id +
          ')">Edit</button>' +
          '<button onclick="deleteInfo(' +
          data.rows.item(i).id +
          ')">Delete</button>';

        tableRow.setAttribute("id", "tic" + data.rows.item(i).id);
        tableRow.appendChild(uId);
        tableRow.appendChild(uName);
        tableRow.appendChild(uEmail);
        tableRow.appendChild(airLines);
        tableRow.appendChild(uTicClass);
        tableRow.appendChild(uMealList);
        tableRow.appendChild(uLeavingFrom);
        tableRow.appendChild(uGongTo);
        tableRow.appendChild(controls);

        document.querySelector("#ticketInfo tbody").appendChild(tableRow);
      }
    });
  });
};
