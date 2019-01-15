const db = openDatabase(
  "ticketBookingDB",
  "1.0.0",
  "Ticket Booking Offline App",
  2 * 1024 * 1024
);

db.transaction(tx => {
  tx.executeSql(
    "Create Table If Not Exists TicketBooking (id integer primary key autoincrement, name, email, airlines, ticketClass, leavingFrom, goingTo)"
  );
});

document.querySelector("#btnSubmit").addEventListener("click", () => {
  let userTitle = document.querySelector("#title").value;
  let userFirstName = document.querySelector("#fName").value;
  let userLastName = document.querySelector("#lName").value;
  let userEmail = document.querySelector("#email").value;
  let airlines = document.querySelector("#airlines").value;
  let ticketClass = document.querySelector("#ticketClass").value;
  let leavingFrom = document.querySelector("#leavingFrom").value;
  let goingTo = document.querySelector("#goingTo").value;

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
        "Insert Into TicketBooking ( name, email, airlines, ticketClass, leavingFrom, goingTo) Values (?,?,?,?,?,?)",
        [name, userEmail, airlines, ticketClass, leavingFrom, goingTo],
        (tx, result) => {
          let id = result.insertId;

          let tableRow = document.createElement("tr");
          let uId = document.createElement("td");
          let uName = document.createElement("td");
          let uEmail = document.createElement("td");
          let airLines = document.createElement("td");
          let uTicClass = document.createElement("td");
          let uLeavingFrom = document.createElement("td");
          let uGongTo = document.createElement("td");
          let controls = document.createElement("td");

          uId.textContent = id;
          uName.textContent = name;
          uEmail.textContent = userEmail;
          airLines.textContent = airlines;
          uTicClass.textContent = ticketClass;
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
        document.querySelector("#controlsBtn #btnSubmit").remove();
        let btnUpdate = document.createElement("button");
        btnUpdate.setAttribute("onclick", "upInfo()");
        btnUpdate.textContent = "Update";

        document.querySelector("#controlsBtn").appendChild(btnUpdate);
        document.querySelector("#id").value = data.id;
        document.querySelector("#title").value = title;
        document.querySelector("#fName").value = fName;
        document.querySelector("#lName").value = lName;
        document.querySelector("#email").value = data.email;
        document.querySelector("#airlines").value = data.airlines;
        document.querySelector("#ticketClass").value = data.ticketClass;
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
  let ticketClass = document.querySelector("#main-form #ticketClass").value;
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
