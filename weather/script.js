const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')


const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryimg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const forecastItemContainer = document.querySelector('.forecast-items-container')

const apiKey ='34bcd684fb54306142476353e9f3d6b0'

searchBtn.addEventListener('click', ()=>{
   if (cityInput.value.trim() !='') {
   updateWeatherInfo(cityInput.value)
    cityInput.value =''
    cityInput.blur()
   }
})
cityInput.addEventListener('keydown',(event) =>{
    if (event.key == 'Enter'&& 
        cityInput.value.trim() !=''
    ){
   updateWeatherInfo(cityInput.value) 
    cityInput.value =''
    cityInput.blur()
    }
})

async function getFetchData(endpoint,city){
const apiUrl ='https://api.openweathermap.org/data/2.5/' + endpoint + "?q=" + city + "&appid=" + apiKey + "&units=metric"

const responce =await fetch(apiUrl)

return responce.json()
}


function getWeaatherIcon(id){
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'



}
function getCurrentDate(){
    const currentDate = new Date()
    const options={
        weekdays: 'short',
        day:'2-digit',
        month: 'short'
    }
   return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city){
const weatherData =await getFetchData('weather', city)
if(weatherData.cod != 200){
    showDisplaySection(notFoundSection)
    return
}


const{
    name: country,
    main:{temp,humidity},
    weather:[{ id,main}],
    wind:{speed}

}=weatherData
countryTxt.textContent = country
tempTxt.textContent= Math.round(temp)+'°C'
conditionTxt.textContent=main
humidityValueTxt.textContent= humidity +'%'
windValueTxt.textContent= speed+' M/s '

currentDateTxt.textContent= getCurrentDate()


weatherSummaryimg.scr = `assets/weather/${getWeaatherIcon(id)}`
await updateforecastsInfo(city)
    showDisplaySection(weatherInfoSection)

}

async function updateforecastsInfo(city){
    const forecastsData = await getFetchData('forecast',city)

    const timeTake = '12:00:00'
    const todayDate = new Date().toISOString()
    console.log(todayDate.split('T'[0]))
    
    forecastItemContainer.innerHTML =''
    forecastsData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTake)&& 
          !forecastWeather.dt_txt.includes(todayDate)){
        updateForecastItems(forecastWeather)
        }
    })
 }
function updateForecastItems(weatherData){
console.log(weatherData)
const{
    dt_txt: date,
    weather:[{ id }],
    main:{ temp}
}= weatherData

const dateTaken = new Date(date)
const dateOption ={
    day:'2-digit',
    month: 'short'
}
const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)
const forecastItem =`
<div class="forecast-item">
                <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                <img src="assets/weather/${getWeaatherIcon(id)}" class="weather-summary-img">
                <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
            </div>
`

forecastItemContainer.insertAdjacentHTML('beforeend',forecastItem)
}
function showDisplaySection(section){
[weatherInfoSection,searchCitySection,notFoundSection]
.forEach(section => section.style.display ='none')
section.style.display ='flex'
}