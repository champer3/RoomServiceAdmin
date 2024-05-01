import cookiesImg from './Img.png'
import iceCreamImg from './ice-cream.png'
import hotPocketsImg from './HotPockets.png'
import bottleImg from './bottleImg.png'
import cheeseImg from './cheese.png'
import therafleuImg from './Therafleu.png'
import batteriesImg from './batteries.png'
import veggiesImg from './veggies.png'
import cokeImg from './coke.png'
import ohioImg from './Ohio.png'
import oklahomaImg from './Oklahoma.png'
import maineImg from './Maine.png'
import rhodeIsland from './Rhode Island.png'
import illinoisImg from './Illinois.png'


export const PRODUCT_DATA = [{ productName: 'Chips Ahoy! Chewy Chocolate Chip Cookies', category: 'Snacks', amount: 1240, productImg: cookiesImg },
{ productName: "Ben & Jerry's Half Baked Ice Cream Pint", category: 'Ice Cream', amount: 1189, productImg: iceCreamImg },
{ productName: 'Hot Pockets Frozen Crispy Buttery Crust Hickory', category: 'Frozen', amount: 1100, productImg: hotPocketsImg },
{ productName: 'AriZona Watermelon Tea 34oz Btl', category: 'Drinks', amount: 908, productImg: bottleImg },
{ productName: 'Belgioioso Italian Cheese Board - 12oz', category: 'Fresh Grocery', amount: 900, productImg: cheeseImg },
{ productName: 'Theraflu Green Tea & Honey Lemon', category: 'Health', amount: 870, productImg: therafleuImg },
{ productName: 'Basically, 8ct AAA Alkaline Batteries', category: 'Home', amount: 870, productImg: batteriesImg },
]

export const CATEGORY_DATA = [
    { percent: 12, category: 'Snacks', amount: '1,509', productImg: cookiesImg, imageBackground: '#F4ECFB' },
    { percent: -5, category: 'Ice Cream', amount: '1460', productImg: iceCreamImg, imageBackground: '#FFF0EA' },
    { percent: 0, category: 'Fresh Grocery', amount: '1,229', productImg: veggiesImg, imageBackground: '#E9FAF7' },
    { percent: 19, category: 'Drinks', amount: '982', productImg: cokeImg, imageBackground: '#FEECEE' },
    { percent: -25, category: 'Health', amount: '791', productImg: therafleuImg, imageBackground: '#EAF8FF' },
    { percent: 11, category: 'Home', amount: '679', productImg: batteriesImg, imageBackground: '#FFFAE7' },
    { percent: 11, category: 'Frozen', amount: '679', productImg: hotPocketsImg, imageBackground: '#F0F1F3' },
]

export const TABLE_DATA = [{
    product: 'Chips Ahoy! Chewy Chocolate Chip Cookies',
    extra: '+3 other products',
    image: cookiesImg,
    customerName: 'John Bushmill',
    customerEmail: 'Johnb@gmail.com',
    total: 121,
    status: 'Processing'
},
{
    product: 'AriZona Watermelon Tea 34oz Btl',
    extra: '+1 other products',
    image: bottleImg,
    customerName: 'Ilham Budi Agung',
    customerEmail: 'ilahmbudi@mail.com',
    total: 590,
    status: 'Processing'
},
{
    product: 'Theraflu Green Tea & Honey Lemon',
    extra: '',
    image: therafleuImg,
    customerName: 'Mohammad Karim',
    customerEmail: 'm_karim@mail.com',
    total: 125,
    status: 'Shipped'
},
{
    product: 'Basically, 8ct AAA Alkaline Batteries',
    extra: '+1 other products',
    image: batteriesImg,
    customerName: 'Linda Blair',
    customerEmail: 'lindablair@mail.com',
    total: 348,
    status: 'Shipped'
},
{
    product: 'Hot Pockets Frozen Crispy Buttery Crust Hickory',
    extra: '',
    image: hotPocketsImg,
    customerName: 'Josh Adam',
    customerEmail: 'josh_adam@mail.com',
    total: 607,
    status: 'Delivered'
}]

export const STATES_DATA = [
    {
        name: 'Ohio',
        customers: 1240,
        color: '#22CAAD',
        percent: '80',
        image: ohioImg
    },
    {
        name: 'Maine',
        customers: 1145,
        color: '#F86624',
        percent: '60',
        image: maineImg
    },
    {
        name: 'Oklahoma',
        customers: 986,
        color: '#F9C80E',
        percent: '49',
        image: oklahomaImg
    },
    {
        name: 'Rhode Island',
        customers: 1120,
        color: '#BC6C25',
        percent: '100',
        image: rhodeIsland
    },
    {
        name: 'Illinois',
        customers: 1080,
        color: '#EB3D4D',
        percent: '50',
        image: illinoisImg
    }
]

const randomIntegers = Array.from({ length: 363  }, () => Math.floor(100 + Math.random() * 101))
randomIntegers.push(10, 500)
const start = new Date(2023, 0, 1)
const end = new Date(2024, 0, 1)
const dateRange = []
let currentDate = start
while (currentDate <= end){
    dateRange.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
}

export const graphData = [] 

for (let i = 0; i < dateRange.length; i++) {
    graphData.push({
        date: dateRange[i].toISOString().slice(0, 10),
        value: randomIntegers[i]
    })
}
graphData.sort((a, b) => new Date(a.date) - new Date(b.date));


export const numbers = [];
let i = 1;
while (i <= 100) {
  numbers.push(i);
  i++;
}