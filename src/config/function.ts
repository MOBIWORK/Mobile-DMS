export const formatMoney = (amount: number | string | any) => {
    return `${amount}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };
 export  const  formatPhoneNumber = (phoneNumber:string) => {
    const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (numericPhoneNumber.length === 10 && numericPhoneNumber.startsWith('0')) {
      return `+84 ${numericPhoneNumber.substring(1)}`;
    }
  
    return phoneNumber;
  }
  