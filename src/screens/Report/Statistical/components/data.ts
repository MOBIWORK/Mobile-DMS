export type ItemCardCustomer = {
    nameCompany:string,
    customerCode:string,
    amount:number,
    total:number
}
export type ItemCardProduct = {
    nameCompany:string,
    customerCode:string,
    amount:number,
    total:number,
    unit:string
}



export  const dataCustomer:ItemCardCustomer[] = [
    {
        
        nameCompany:'Công ty TNHH ABC',
        customerCode:'KH-122455',
        amount:10,
        total:4000000
    },
    {
        
        nameCompany:'Công ty TNHH ACB',
        customerCode:'KH-122456',
        amount:11,
        total:4400000
    },
    {
        
        nameCompany:'Công ty TNHH ABC',
        customerCode:'KH-122457',
        amount:9,
        total:3600000
    },
]
export  const dataProduct:ItemCardProduct[] = [
    {
        
        nameCompany:'Công ty TNHH ABC',
        customerCode:'KH-122455',
        amount:10,
        total:400000000,
        unit:'Hộp'
    },
    {
        
        nameCompany:'Công ty TNHH ACB',
        customerCode:'KH-122456',
        amount:11,
        total:440000000,
        unit:'Thùng'
    },
    {
        
        nameCompany:'Công ty TNHH ABC',
        customerCode:'KH-122457',
        amount:9,
        total:36000000,
        unit:'Tấn'
    },
]