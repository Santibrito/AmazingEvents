const URI = "https://amazing-events.herokuapp.com/api/events"
const locationPage = document.location.pathname
const inputSearch = document.getElementById('search')
const containerChekbox = document.getElementById('chekbox-container')
const containerCard = document.getElementById('card-container')
const detailsContainer = document.getElementById('details-container')
const mybutton = document.getElementById("btn-back-to-top");

loadDataAPI(URI)

function loadDataAPI(urlAPI) {
   fetch(urlAPI).then(respuesta => respuesta.json()).then(data => {
      let events = data.events

      if (locationPage == "/index.html") {
         arrayData = events
         printLetters(events)
         filterSerch(events, '')
         printChekbox(events)
         filerChekbox(events)

      } else if (locationPage == "/upcoming_events.html") {
         let filterUpcoming = events.filter((UpcomingEvents) => UpcomingEvents.date > data.currentDate)

         arrayData = filterUpcoming
         printLetters(filterUpcoming)
         filterSerch(filterUpcoming, '')
         printChekbox(filterUpcoming)
         filerChekbox(filterUpcoming)
      } else if (locationPage == "/past_events.html") {
         let filterPast = events.filter((pastEvent) => pastEvent.date < data.currentDate)

         arrayData = filterPast
         printLetters(filterPast)
         filterSerch(filterPast, '')
         printChekbox(filterPast)
         filerChekbox(filterPast)

      } else if (locationPage == "/details.html") {
         let idDetails = location.search.split('?id=').join('')
         let carDetails = events.filter((idEvent) => idEvent._id == idDetails)[0]

         detailsContainer.innerHTML =
            `
       
       <div class="container_banner_details"
       style="background-image: url('${carDetails.image}');">
    </div>
    <div class="container_banner_details_txt container">
       <div class="banner_details_title">
          <div class="text">
             <h2> 
                <span
                   data-aos="fade-up"
                   data-aos-duration="1000"
                   style="text-transform: uppercase"
                   >${carDetails.name}</span>
               
                <br>
             </h2>
          </div>
          <div class="line">
             <hr data-aos="fade-up"
                data-aos-duration="1000">
          </div>
       </div>
       <div class="banner_upcoming_txt">
          <p data-aos="fade-up"
             data-aos-anchor="#example-anchor"
             data-aos-offset="0"
             data-aos-duration="500"
             >
             ${carDetails.description}</p>
          <br>
          <p
             data-aos="fade-up"
             data-aos-anchor="#example-anchor"
             data-aos-offset="0"
             data-aos-duration="1600"
             ><span>Date:</span> ${carDetails.date}</p>
          <p
             data-aos="fade-up"
             data-aos-anchor="#example-anchor"
             data-aos-offset="0"
             data-aos-duration="1500"
             ><span>Category:</span> ${carDetails.category}</p>
          <p
             data-aos="fade-up"
             data-aos-anchor="#example-anchor"
             data-aos-offset="0"
             data-aos-duration="1400"
             ><span>Place:</span> ${carDetails.place}</p>
          <p
             data-aos="fade-up"
             data-aos-anchor="#example-anchor"
             data-aos-offset="0"
             data-aos-duration="1300"
             ><span>Capacity:</span> ${carDetails.capacity}</p>
          <p
             data-aos="fade-up"
             data-aos-anchor="#example-anchor"
             data-aos-offset="0"
             data-aos-duration="1200"
             >
             <span>${carDetails['assistance'] ? 'Assistance:' : 'Estimated:'} </span>${carDetails['assistance'] ? carDetails['assistance'] : carDetails['estimate']}</p>
          <p
             data-aos="fade-up"
             data-aos-anchor="#example-anchor"
             data-aos-offset="0"
             data-aos-duration="1000"
             ><span>Price:</span> $${carDetails.price}
          </p>

          
       </div>

       
    </div>
    <div class="container text-center p-5">
    <a href="index.html" class="btn">Back to home</a>
    </div>
    `

      } else if (locationPage == "/stats.html") {
         let filterPast = events.filter((pastEvent) => pastEvent.date < data.currentDate)
         let filterUpcoming = events.filter((UpcomingEvents) => UpcomingEvents.date > data.currentDate)

         staticsTable(filterPast)

         value_estimate = 'estimate'
         value_assistance = 'assistance'

         let selectorUpcoming = document.getElementById(`upcomingStats`)
         let selectorPast = document.getElementById(`pastStats`)

         counter = 0

         counter = eventsStatistics(filterUpcoming, value_estimate, selectorUpcoming, counter)
         eventsStatistics(filterPast, value_assistance, selectorPast, counter)
         eve = filterUpcoming[2]
      }
   })
}

//Solamente se cumplen las condiciones en las siguientes paginas
if (locationPage == '/index.html' || locationPage == '/upcoming_events.html' || locationPage == '/past_events.html') {

   //Filtra por input
   containerChekbox.addEventListener('change', () => {
      let filterArray = filerChekbox(arrayData)
      printLetters(filterArray)
   })

   //Busqueda por serch
   inputSearch.addEventListener('keyup', () => {
         let filterArray = filterSerch(arrayData, inputSearch.value)
         console.log(inputSearch.value)
         printLetters(filterArray)
      },
      window.onscroll = function () {
         scrollFunction();
      })

   function scrollFunction() {
      if (
         document.body.scrollTop > 1200 ||
         document.documentElement.scrollTop > 1200
      ) {
         mybutton.style.display = "block";
      } else {
         mybutton.style.display = "none";
      }
   }

   mybutton.addEventListener("click", backToTop);

   function backToTop() {
      document.body.scrollTop = 950;
      document.documentElement.scrollTop = 950;
   }
}

//Crea las cards
function printLetters(arrayData) {

   containerCard.innerHTML = ''
   if (arrayData.length == 0) {
      let alert = document.createElement('div')
      alert.className = 'alert container container_section_alert '
      alert.innerHTML = ` <h2>
        <span>NO</span>
        <span>EVENT</span>
        <span>FOUND</span>
        <span>TO</span>
        <span>DISPLAY!</span>
      </h2>
      <h5>The event you were looking for was not found!</h5>
      `
      containerCard.appendChild(alert)

   } else {
      arrayData.forEach(data => {
         let divCard = document.createElement('div')
         divCard.className = 'card'
         divCard.innerHTML = ` <div class="col ">
            <div class="card h-100 ">
            <img src="${data.image}" class="card-img-top" alt="Museo"/>
            <div class="card-body">
                <h5 class="card-title">${data.name}</h5>
                <p class="card-text">${data.description}</p>
                <div class="card-footer container_btn">
                    <p>$${data.price}</p>
                    <a href="details.html?id=${data._id}">See more</a>
                </div>
            </div>
            </div>
            </div>`
         containerCard.appendChild(divCard)
      })
   }
}

//Filtra por Serch
function filterSerch(arrayData, text) {
   let filterArray = arrayData.filter(elemento => elemento.name.toLowerCase().includes(text.toLowerCase().trim()))
   return filterArray
}

//Crea los chekbox
function printChekbox(arrayData) {

   let category = []
   arrayData.forEach(data => {
      if (!category.includes(data.category)) {
         category.push(data.category)
      }
   })
   category.forEach(category => {
      let inputCreator = document.createElement("div")
      inputCreator.innerHTML =
         `
        <div class="checkbox">
                <label>
                <input type="checkbox" class="inputCheckBox" value="${category}" /> 
                ${category}
                </label>
        </div>
        `
      containerChekbox.appendChild(inputCreator)
   })
}

//Filtra por chekbox
function filerChekbox(arrayData) {
   let filterArray = []
   let chekboxes = document.querySelectorAll('input[type="checkbox"]')
   let arrayChekboxes = Array.from(chekboxes)
   let arrayChekboxesFiltrados = arrayChekboxes.filter(chekbox => chekbox.checked)
   let arrayValuesOfChekboxes = arrayChekboxesFiltrados.map(chekbox => chekbox.value)
   filterArray = arrayData.filter(elemento => arrayValuesOfChekboxes.includes(elemento.category))
   if (filterArray.length == 0) {
      return arrayData
   } else {
      return filterArray
   }
}

//Filtra las categorias
function staticsTable(arrayDataPast) {
   let eventsArray = []
   let percentage = []
   let capacity = []

   for (let i = 0; i < arrayDataPast.length; i++) {
      let calculePorc = (arrayDataPast[i].assistance * 100) / (arrayDataPast[i].capacity)
      var event = new Object();
      event.name = arrayDataPast[i].name
      event.assistance = calculePorc
      event.capacity = arrayDataPast[i].capacity
      eventsArray.push(event)
      percentage.push(calculePorc)
      capacity.push(arrayDataPast[i].capacity)
   }

   eventsArray.sort((a, b) => b.assistance - a.assistance)
   let increasedAttendance = eventsArray[0]

   eventsArray.sort((b, a) => b.assistance - a.assistance)
   let minorAttendance = eventsArray[0]

   eventsArray.sort((a, b) => b.capacity - a.capacity)
   let greaterCapacity = eventsArray[0]

   let containerTableID = document.getElementById('container-Table')
   let label = `
    <td id="into-table">In ${increasedAttendance.name} <br>with an %${increasedAttendance.assistance} assistance</td>
    <td id="into-table">In ${minorAttendance.name} <br>with an %${minorAttendance.assistance} assistance</td>
    <td id="into-table">In ${greaterCapacity.name}  <br>with an ${greaterCapacity.capacity} capacity</td>`

   containerTableID.innerHTML = label
}

//Filtra las tablas
function eventsStatistics(arrayData, valor, selectorID) {

   let convertPrice = Intl.NumberFormat('en-US');

   let categories = arrayData.map(function (x) {
      return x.category;
   });

   let result = categories.filter((item, index) => {
      return categories.indexOf(item) === index;
   })

   let containerArray = []
   iterator = counter
   let label = ``
   for (let i = 0; i < result.length; i++) {
      acum = 0
      cont = 0
      sumOfIncome = 0
      label += `<tr id="${counter}"></tr>`
      selectorID.innerHTML = label
      for (let j = 0; j < arrayData.length; j++) {
         if (result[i] == arrayData[j].category) {

            sumOfIncome += arrayData[j].price * arrayData[j][valor]
            let attendanceCalculation = (arrayData[j][valor] * 100) / (arrayData[j].capacity)
            acum += attendanceCalculation
            cont = cont + 1
         }
      }
      let average = acum / cont
      let eventFilter = new Object();
      eventFilter.name = result[i]
      eventFilter.income = sumOfIncome
      eventFilter.estimate = average
      containerArray.push(eventFilter)
      counter = counter + 1

   }

   cont = 0
   for (let i = iterator; i < (containerArray.length + iterator); i++) {
      let selectorIteration = document.getElementById(`${i}`)

      label = `
        <td id="into-table">${containerArray[cont].name}</td>
        <td id="into-table">$ ${convertPrice.format(containerArray[cont].income)}</td>
        <td id="into-table">% ${Number((containerArray[cont].estimate).toFixed(2))}</td>
        `
      selectorIteration.innerHTML = label
      cont++
   }
   return counter
}
