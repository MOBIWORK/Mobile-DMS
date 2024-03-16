export type IProduct = {
  listCustomerVisit: any[];
  listCustomer: {
    data: any[];
    page_number: number;
    page_size: number;
    total: number;
  };
  newCustomer: any[];
  listCustomerType: any[];
  mainAddress: any;
  mainContactAddress: any;
  listCustomerTerritory: any[];
  listCustomerRoute: any[];
};
