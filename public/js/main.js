const db = openDatabase(
  "ticketBookingDB",
  "1.0.0",
  "Ticket Booking Offline App",
  2 * 1024 * 1024
);

db.transaction(tx => {
  tx.executeSql(
    "Create Table If Not Exists TicketBooking (id integer primary key autoincrement, name, email, airlines, mealList, ticketClass, leavingFrom, goingTo,fileName)"
  );
});

// Get Filename
let filename;
var fileupload = document.getElementById("fileUpload");
fileupload.addEventListener("change", function(event) {
  var files = fileupload.files;
  filename = encodeURI(files[0].name);
});

// Save Data
let submitBtn = document.querySelector("#btnSubmit");

submitBtn.addEventListener("click", () => {
  document.querySelector("#main-form").addEventListener("submit", () => {
    let userTitle = document.querySelector("#title").value;
    let userFirstName = document.querySelector("#fName").value;
    let userLastName = document.querySelector("#lName").value;
    let userEmail = document.querySelector("#email").value;
    let airlines = document.querySelector("#airlines").value;

    let ticketClass;

    document.querySelector('input[name="ticketClass"]:checked') === null
      ? (ticketClass = "")
      : (ticketClass = document.querySelector(
          'input[name="ticketClass"]:checked'
        ).value);

    let leavingFrom = document.querySelector("#leavingFrom").value;
    let goingTo = document.querySelector("#goingTo").value;

    let mealList = document.getElementsByName("mealList");

    let userMeal = new Array();
    for (let i = 0; i < mealList.length; i++) {
      if (mealList[i].checked === true) {
        userMeal.push(mealList[i].value);
      }
    }

    let userMealList = userMeal.join(",");

    if (!userFirstName) {
      document.querySelector("#fName").classList.add("error");
    } else if (!userEmail) {
      document.querySelector("#fName").classList.remove("error");
      document.querySelector("#email").classList.add("error");
    } else if (!airlines) {
      document.querySelector("#email").classList.remove("error");
      document.querySelector("#airlines").classList.add("error");
    } else if (leavingFrom === "None") {
      document.querySelector("#airlines").classList.remove("error");
      document.querySelector("#leavingFrom").classList.add("error");
    } else if (goingTo === "None") {
      document.querySelector("#leavingFrom").classList.remove("error");
      document.querySelector("#goingTo").classList.add("error");
    } else {
      document.querySelector("#goingTo").classList.remove("error");
      let name = userTitle + " " + userFirstName + " " + userLastName;
      db.transaction(tx => {
        tx.executeSql(
          "Insert Into TicketBooking(name, email, airlines, ticketClass, mealList, leavingFrom, goingTo,fileName) Values (?,?,?,?,?,?,?,?)",
          [
            name,
            userEmail,
            airlines,
            ticketClass,
            userMealList,
            leavingFrom,
            goingTo,
            filename
          ]
        );
      });
    }
  });
});

// Edit Function
function editInfo(id) {
  let upBtn = document.querySelector("#btnUpdate");
  let saveBtn = document.querySelector("#btnSubmit");

  if (upBtn.hidden === true) {
    upBtn.hidden = false;
    saveBtn.hidden = true;
  }

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
        let meals = "";
        meals = data.mealList.split(",");
        document.querySelector("#id").value = data.id;
        document.querySelector("#title").value = title;
        document.querySelector("#fName").value = fName;
        document.querySelector("#lName").value = lName;
        document.querySelector("#email").value = data.email;

        // Create Image Element
        let userImage = document.querySelector("#imageFile");
        if (userImage.childNodes.length === 1) {
          let label = document.createElement("label");
          label.innerHTML = "Image";
          label.setAttribute("for", "imageFile");
          let img = document.createElement("img");

          img.src = "uploads/" + data.fileName;

          userImage.appendChild(label);
          userImage.appendChild(img);

          userImage.hidden = false;
        }

        let airLine = document.querySelector("#airlines");
        if (airLine.length !== 0) {
          destination(data.airlines);
        }

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

        let mealLists = "";

        mealLists = document.getElementsByName("mealList");

        for (let i = 0; i < mealLists.length; i++) {
          mealLists[i].checked = false;
        }

        for (let i = 0; i < mealLists.length; i++) {
          for (let j = 0; j < meals.length; j++) {
            if (mealLists[i].value === meals[j]) {
              mealLists[i].checked = true;
            } else {
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

// Update Function
let updateBtn = document.querySelector("#btnUpdate");

updateBtn.addEventListener(
  "click",
  () => {
    document
      .querySelector("#main-form")
      .addEventListener("submit", function upInfo() {
        let id = document.querySelector("#main-form #id").value;
        let userTitle = document.querySelector("#main-form #title").value;
        let userFirstName = document.querySelector("#main-form #fName").value;
        let userLastName = document.querySelector("#main-form #lName").value;
        let userEmail = document.querySelector("#main-form #email").value;
        let airlines = document.querySelector("#main-form #airlines").value;
        let ticketClass;
        document.querySelector('input[name="ticketClass"]:checked') === null
          ? (ticketClass = "")
          : (ticketClass = document.querySelector(
              'input[name="ticketClass"]:checked'
            ).value);

        let leavingFrom = document.querySelector("#main-form #leavingFrom")
          .value;
        let goingTo = document.querySelector("#main-form #goingTo").value;

        let mealList = document.getElementsByName("mealList");

        let userMeal = new Array();
        for (let i = 0; i < mealList.length; i++) {
          if (mealList[i].checked === true) {
            userMeal.push(mealList[i].value);
          }
        }

        let userMealList = userMeal.join(",");
        if (!userFirstName) {
          document.querySelector("#fName").classList.add("error");
        } else if (!userEmail) {
          document.querySelector("#fName").classList.remove("error");
          document.querySelector("#email").classList.add("error");
        } else if (!airlines) {
          document.querySelector("#email").classList.remove("error");
          document.querySelector("#airlines").classList.add("error");
        } else if (leavingFrom === "None") {
          document.querySelector("#airlines").classList.remove("error");
          document.querySelector("#leavingFrom").classList.add("error");
        } else if (goingTo === "None") {
          document.querySelector("#leavingFrom").classList.remove("error");
          document.querySelector("#goingTo").classList.add("error");
        } else {
          document.querySelector("#goingTo").classList.remove("error");
          let name = userTitle + " " + userFirstName + " " + userLastName;

          db.transaction(tx => {
            tx.executeSql(
              "Update TicketBooking Set name = ?, email = ?, airlines = ?, ticketClass = ?, mealList = ?, leavingFrom = ?, goingTo = ?, fileName = ? Where id = ?",
              [
                name,
                userEmail,
                airlines,
                ticketClass,
                userMealList,
                leavingFrom,
                goingTo,
                filename,
                id
              ]
            );
          });
        }
        location.reload();
      });
  },
  false
);

// Delete Function
function deleteInfo(id) {
  db.transaction(tx => {
    tx.executeSql("Delete From TicketBooking Where id = ?", [id]);
  });
  location.reload();
}

// Show Data On Load

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
        let image = document.createElement("td");
        let file = document.createElement("img");
        let controls = document.createElement("td");

        uId.textContent = data.rows.item(i).id;
        uName.textContent = data.rows.item(i).name;
        uEmail.textContent = data.rows.item(i).email;
        airLines.textContent = data.rows.item(i).airlines;
        uTicClass.textContent = data.rows.item(i).ticketClass;
        uMealList.textContent = data.rows.item(i).mealList;
        uLeavingFrom.textContent = data.rows.item(i).leavingFrom;
        uGongTo.textContent = data.rows.item(i).goingTo;
        file.src = "uploads/" + data.rows.item(i).fileName;

        image.appendChild(file);

        controls.innerHTML =
          '<span class="edit-icon" onclick="editInfo(' +
          data.rows.item(i).id +
          ')"><i class="fas fa-edit"></i></span>' +
          '<span class="delete-icon" onclick="deleteInfo(' +
          data.rows.item(i).id +
          ')"><i class="fas fa-trash-alt"></i></span>';

        tableRow.setAttribute("id", "tic" + data.rows.item(i).id);
        tableRow.appendChild(uId);
        tableRow.appendChild(uName);
        tableRow.appendChild(uEmail);
        tableRow.appendChild(airLines);
        tableRow.appendChild(uTicClass);
        tableRow.appendChild(uMealList);
        tableRow.appendChild(uLeavingFrom);
        tableRow.appendChild(uGongTo);
        tableRow.appendChild(image);
        tableRow.appendChild(controls);

        document.querySelector("#ticketInfo tbody").appendChild(tableRow);
      }
    });
  });
};

// Get Destination Select
function destination(data) {
  let leavForm = document.querySelector("#leavingFrom");
  let goingTo = document.querySelector("#goingTo");
  leavForm.innerHTML = "";
  goingTo.innerHTML = "";
  var routes;
  if (data === "US-Bangla") {
    routes = ["None|None", "Chittagong|Chittagong", "Dhaka|Dhaka"];
  } else if (data === "Regent Airways") {
    routes = [
      "None|None",
      "Chittagong|Chittagong",
      "Borisal|Borisal",
      "Bogura|Bogura"
    ];
  } else if (data === "Novoair") {
    routes = ["None|None", "Dhaka|Dhaka", "Rangpur|Rangpur", "Bogura|Bogura"];
  } else if (data === "Biman Bangladesh") {
    routes = [
      "None|None",
      "Dhaka|Dhaka",
      "Rangpur|Rangpur",
      "Cox-Bazar|Cox-Bazar"
    ];
  } else {
    routes = ["None|None"];
  }

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
}
