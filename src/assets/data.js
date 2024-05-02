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
import snacksImg from './snacks.png'
import foodImg from './food.png'
import healthImg from './health.png'
import homeImg from './home.png'
import groceriesImg from './groceries.png'
import iceCreamCategoryImg from './ice cream.png'
import alcoholImg from './alcohol.png'
import drinksImg from './drinks.png'


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

const randomIntegers = Array.from({ length: 363 }, () => Math.floor(100 + Math.random() * 101))
randomIntegers.push(10, 500)
const start = new Date(2023, 0, 1)
const end = new Date(2024, 0, 1)
const dateRange = []
let currentDate = start
while (currentDate <= end) {
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

export const PRODUCT_LIST = [
    {
        image: cookiesImg,
        name: 'Chips Ahoy! Chewy Chocolate Chip Cookies',
        SKU: 302012,
        category: 'Snacks',
        stock: 10,
        price: 3.99,
        status: 'Low Stock',
        dateAdded: new Date(2023, 11, 29)
    },
    {
        image: iceCreamImg,
        name: "Ben & Jerry's Half Baked Ice Cream Plantain",
        SKU: 302011,
        category: 'Ice Cream',
        stock: 204,
        price: 5.99,
        status: 'Published',
        dateAdded: new Date(2023, 11, 24)
    },
    {
        image: hotPocketsImg,
        name: "Hot Pockets Frozen Crispy Buttery Crusted Chicken",
        SKU: 302002,
        category: 'Frozen',
        stock: 48,
        price: 4.99,
        status: 'Draft',
        dateAdded: new Date(2022, 11, 12)
    },
    {
        image: therafleuImg,
        name: "Theraflu Green Tea & Honey Lemon",
        SKU: 301901,
        category: 'Health',
        stock: 401,
        price: 12.99,
        status: 'Published',
        dateAdded: new Date(2021, 9, 21)
    },
]

export const CATEGORIES_LIST = [
    {
        image: snacksImg,
        name: 'Snacks',
        sold: 12100,
        stock: 10,
        dateAdded: new Date(2022, 11, 29),
    },
    {
        image: foodImg,
        name: 'Food',
        sold: 59000,
        stock: 204,
        dateAdded: new Date(2022, 11, 24),
    },
    {
        image: healthImg,
        name: 'Health',
        sold: 12500,
        stock: 48,
        dateAdded: new Date(2022, 11, 12),
    },
    {
        image: homeImg,
        name: 'Home',
        sold: 34800,
        stock: 401,
        dateAdded: new Date(2022, 9, 21),
    },
    {
        image: groceriesImg,
        name: 'Fresh Groceries',
        sold: 60700,
        stock: 120,
        dateAdded: new Date(2022, 9, 21),
    },
    {
        image: iceCreamCategoryImg,
        name: 'Ice Cream',
        sold: 23400,
        stock: 432,
        dateAdded: new Date(2022, 9, 21),
    },
    {
        image: alcoholImg,
        name: 'Alcohol',
        sold: 76000,
        stock: 0,
        dateAdded: new Date(2022, 8, 19),
    },
    {
        image: drinksImg,
        name: 'Drinks',
        sold: 400,
        stock: 347,
        dateAdded: new Date(2022, 8, 19),
    },
]

export const ORDER_LIST = [
    {
        ID: 302012,
        image: cookiesImg,
        name: 'Chips Ahoy Chocolate Chip Cookies',
        extra: '+3 products',
        date: new Date(2022, 11, 29),
        customer: 'John Bushmill',
        total: 120,
        payment: 'Mastercard',
        status: 'Processing',
    },
    {
        ID: 302011,
        image: cookiesImg,
        name: 'Chips Ahoy Chocolate Chip Cookies',
        extra: '+3 products',
        date: new Date(2022, 11, 24),
        customer: 'Linda Blair',
        total: 590,
        payment: 'Visa',
        status: 'Delivered',
    },
    {
        ID: 302002,
        image: cookiesImg,
        name: 'Chips Ahoy Chocolate Chip Cookies',
        extra: '+3 products',
        date: new Date(2022, 11, 12),
        customer: 'M Karim',
        total: 125,
        payment: 'Mastercard',
        status: 'Canceled',
    },
    {
        ID: 301901,
        image: cookiesImg,
        name: 'Chips Ahoy Chocolate Chip Cookies',
        extra: '+3 products',
        date: new Date(2022, 9, 12),
        customer: 'Rajesh Masvidal',
        total: 348,
        payment: 'Mastercard',
        status: 'Shipped',
    },
    {
        ID: 301900,
        image: cookiesImg,
        name: 'Chips Ahoy Chocolate Chip Cookies',
        extra: '+3 products',
        date: new Date(2022, 9, 12),
        customer: 'Laura Prichet',
        total: 607,
        payment: 'Visa',
        status: 'Shipped',
    },
    {
        ID: 301881,
        image: cookiesImg,
        name: 'Chips Ahoy Chocolate Chip Cookies',
        extra: '+3 products',
        date: new Date(2022, 9, 12),
        customer: 'Tracy Williams',
        total: 234,
        payment: 'Mastercard',
        status: 'Delivered',
    },
    {
        ID: 301643,
        image: cookiesImg,
        name: 'Chips Ahoy Chocolate Chip Cookies',
        extra: '+3 products',
        date: new Date(2022, 8, 19),
        customer: 'Bryan Barker',
        total: 760,
        payment: 'PayPal',
        status: 'Canceled',
    },
    {
        ID: 301600,
        image: cookiesImg,
        name: 'Chips Ahoy Chocolate Chip Cookies',
        extra: '+3 products',
        date: new Date(2022, 8, 19),
        customer: 'Josh Adam',
        total: 400,
        payment: 'PayPal',
        status: 'Delivered',
    },
    {
        ID: 301555,
        image: cookiesImg,
        name: 'Chips Ahoy Chocolate Chip Cookies',
        extra: '+3 products',
        date: new Date(2022, 8, 19),
        customer: 'Lucy Driver',
        total: 812,
        payment: 'Mastercard',
        status: 'Delivered',
    },
    {
        ID: 301002,
        image: cookiesImg,
        name: 'Chips Ahoy Chocolate Chip Cookies',
        extra: '+3 products',
        date: new Date(2022, 7, 10),
        customer: 'Alex Holland',
        total: 123,
        payment: 'Mastercard',
        status: 'Canceled',
    },
]

export const ORDER_DETAILS_LIST = [
    {
        image: cookiesImg,
        name: "Chips Ahoy! Chewy Chocolate Chips",
        category: "Snacks",
        SKU: 302011,
        quantity: 1,
        price: 10,
    },
    {
        image: cookiesImg,
        name: "Chips Ahoy! Chewy Chocolate Chips",
        category: "Snacks",
        SKU: 302011,
        quantity: 3,
        price: 5,
    },

    
]

export const CUSTOMER_LIST = [
    {
        name: "John Bushmill",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Laura Prichet",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Ahmad Karim",
        status: "Blocked",
        orders: 12091,
        spent: 12091
    },
    {
        name: "John Bill",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Luke Adam",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Sin Tae",
        status: "Blocked",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Rajesh Masvidal",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Fajar Surya",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Lisa Greg",
        status: "Blocked",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Linda Blair",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Lucy Driver",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Bryan Barker",
        status: "Blocked",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Alex Holland",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Tracy Williams",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Linda Barker",
        status: "Active",
        orders: 12091,
        spent: 12091
    },
    {
        name: "Nick Bade-John",
        status: "Blocked",
        orders: 123456,
        spent: 10000000
    },
    {
        name: "Stan Parker",
        status: "Blocked",
        orders: 123456,
        spent: 10000000
    },
    {
        name: "Richard Gray",
        status: "Blocked",
        orders: 123456,
        spent: 10000000
    },
    {
        name: "Mark Stewart",
        status: "Active",
        orders: 123456,
        spent: 102000
    },
    {
        name: "Nathan Smith",
        status: "Active",
        orders: 123456,
        spent: 1000
    },
    {
        name: "Jean Grey",
        status: "Active",
        orders: 12356,
        spent: 100000
    },
    {
        name: "Jake Hartmann",
        status: "Blocked",
        orders: 123456,
        spent: 10000000
    },
    {
        name: "Taylor Johnson",
        status: "Active",
        orders: 123456,
        spent: 10000000
    },
    {
        name: "Payton Manning",
        status: "Blocked",
        orders: 123456,
        spent: 10000000
    },
]

export const CUSTOMER_DETAIL_LIST = [
    {
        image: cookiesImg,
        name: 'Chips Ahoy! Chewy Chocolate Chip Cookies',
        extra: '+3 other products',
        SKU: 302002,
        total: 121,
        status: 'Processing',
        dateAdded: new Date(2023, 11, 12)
    },
    {
        image: bottleImg,
        name: 'Arizona Water anfsgkgdvjg',
        extra: '+1 other product',
        SKU: 301901,
        total: 590,
        status: 'Processing',
        dateAdded: new Date(2023, 11, 1)
    },
    {
        image: therafleuImg,
        name: "Therafleu Green Herbal Tea",
        extra: "",
        SKU: 301900,
        total: 125,
        status: 'Shipped',
        dateAdded: new Date(2022, 10, 10)
    },
    {
        image: batteriesImg,
        name: "Basically 8CT Batteries",
        extra: "+1 other product",
        SKU: 301881,
        total: 348,
        status: 'Shipped',
        dateAdded: new Date(2022, 10, 2)
    },
    {
        image: hotPocketsImg,
        name: "Hot Pockets adsfgsfndvn",
        extra: "",
        SKU: 301643,
        total: 607,
        status: 'Delivered',
        dateAdded: new Date(2022, 8, 7)
    },
]

