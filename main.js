import axios from 'axios'

const weather = document.querySelector('.weather')
const temp = document.querySelector('.temp')
const humid = document.querySelector('.humidity')
const windDir = document.querySelector('.wind')
const windSpeed = document.querySelector('.windspeed')

let nowNx = 60
let nowNy = 127

//오늘 날짜를 8자리로 변환하기
const date = new Date();
const monthNum = function(){
  if(date.getMonth() < 10){
    return `0${date.getMonth()+1}`
  }else{
    return `${date.getMonth()}`
  }
}
const dayNum = function(){
  if(date.getDate() < 10){
    return `0${date.getDate()}`
  }else{
    return `${date.getDate()}`
  }
}
const now = `${date.getFullYear()}` + `${monthNum()}` + `${dayNum()}`;

const key = '=sJGDBpkf0tDOnvUNqp4MXRzq6i%2Fw09iuzFYD0uB1gYowbRAnmHrBRSK8UcjyS5ZF6aPGwbG0wKG%2BRDMAum%2FWAA%3D%3D&'
async function request() {
  const { data } = await axios({
    url:'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey' + key
    + `pageNo=1&numOfRows=1000&dataType=JSON&base_date=${now}&base_time=0600&nx=${nowNx}&ny=${nowNy}`,
    method:'GET'
  }).catch((error) => {
    console.log(error)
  })
  const arr = data.response.body.items.item
  let filteredData = [arr[0],arr[1],arr[3],arr[5],arr[7]]

  weather.textContent = '강수: ' + dataToWeather(filteredData[0].obsrValue)
  temp.textContent = '기온: ' + filteredData[2].obsrValue + "℃"
  humid.textContent = '습도: ' + filteredData[1].obsrValue + "%"
  windDir.textContent = '풍향: ' + dataToWindDirection(filteredData[3].obsrValue)
  windSpeed.textContent = '풍속: ' + filteredData[4].obsrValue + "m/s"
}
// PTY : 강수형태
// REH : 습도
// T1H : 기온
// VEC : 풍향
// WSD : 풍속



// ;(async function(){
//   const weather = await request()
//   console.log(info)
// })()

//각 주요지역별 위치
const cities = [
  {region:'서울' , nx:60 , ny:127},
  {region:'인천' , nx:55 , ny:124},
  {region:'경기도' , nx:60 , ny:121},
  {region:'강원도' , nx:92 , ny:131},
  {region:'충청북도' , nx:69 , ny:106},
  {region:'충청남도' , nx:68 , ny:100},
  {region:'전라북도' , nx:63 , ny:89},
  {region:'전라남도' , nx:50 , ny:67},
  {region:'경상북도' , nx:91 , ny:106},
  {region:'경상남도' , nx:90 , ny:77},
  {region:'제주도' , nx:52 , ny:38}
]

//input 요소에 입력시에 nx,ny값 출력
const inputEl = document.querySelector('input')
let inputText = ''
inputEl.addEventListener('input',function(){
  inputText = inputEl.value
})

inputEl.addEventListener('keydown',function(event){
  if(event.key === 'Enter' && inputText){
    const findCity = cities.find( city => city.region === inputText)
    nowNx = findCity.nx;
    nowNy = findCity.ny;
    document.querySelector('h2').textContent = inputText + '의 날씨'
    inputEl.value =''
    request()
  }
})

const search = document.querySelector('.search')
search.addEventListener('onClick',function(){
  const findCity = cities.find( city => city.region === inputText)
  nowNx = findCity.nx;
  nowNy = findCity.ny;
  document.querySelector('h2').textContent = inputText + '의 날씨'
  inputEl.value =''
  request()
})

//강수형태를 날씨로
function dataToWeather (tempData){
  switch(tempData){
    case '1':
      return '비'
    case '2':
      return '비/눈'
    case '3':
      return '눈'
    case '4':
      return '소나기'
    case '5':
      return '빗방울'
    case '6':
      return '빗방울눈날람'
    case '7':
      return '눈날림'
    default:
      return '없음'
  }
}
//풍향값 변환
function dataToWindDirection(windData){
  const Wvalue = Math.floor((windData + 22.5*0.5) /  22.5)
  switch(Wvalue){
    case 0:
      return '북(N)'
    case 1:
      return '북북동(NNE)'
    case 2:
      return '북동(NE)'
    case 3:
      return '동북동(ENE)'
    case 4:
      return '동(E)'
    case 5:
      return '동남동(ESE)'
    case 6:
      return '남동(SE)'
    case 7:
      return '남남동(SSE)'
    case 8:
      return '남(S)'
    case 9:
      return '남남서(SSW)'
    case 10:
      return '남서(SW)'
    case 11:
      return '서남서(WSW)' 
    case 12:
      return '서(W)'
    case 13:
      return '서북서(WNW)'  
    case 14:
      return '북서(NW)'  
    case 15:
      return 'NNW(북북서)'
    default:
      return 'N(북)'
  }
}
