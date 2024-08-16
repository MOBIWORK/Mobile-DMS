export type IProduct = {
  listCustomerVisit: any;
  listCustomer: {
    data: any[];
    page_number: number;
    page_size: number;
    total: number;
  } | any;
  newCustomer: any[];
  listCustomerType: any[];
  mainAddress: any;
  mainContactAddress: any;
  listCustomerTerritory: any[];
  listCustomerRoute: any[];
  listTypeCustomer: any[];
  listChannel: any[],
};
