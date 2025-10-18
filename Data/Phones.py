import pandas


DISCOUNT_TERM = 24.0
def calc(df, less_than = 10000, porting_discount = 400.0, premium_unlimited_cost = 53, has_xmc = True):
    ph = df[(round(((df["Price"] - porting_discount)/DISCOUNT_TERM)*100)/100)<= less_than]
    sub = []
    for price in ph["Price"]:
        if price <= porting_discount:
            sub += [price]
        else:
            sub += [porting_discount]
    

    ph["Price"] = (round(((ph['Price'] - sub) / DISCOUNT_TERM)* 100)/100)

    price = ph["Price"] + premium_unlimited_cost 
    if has_xmc:
        ph["Total Cost (50% off XMPP)"] = price + (ph['XMC Price'] * 0.5)
        ph["Total Cost"] = price + ph['XMC Price']
    else:
        ph[0,r"Total Cost (50% off XMPP)"] = price
        ph["Total Cost"] = price

    
    return ph.sort_values(by=r"Total Cost (50% off XMPP)")

COST_OF_PHONE = 10.00
phones = pandas.read_csv(r'C:\Users\bp-gmende544\Desktop\Data\phones.csv')
print(f"LIST OF PHONES < ${COST_OF_PHONE}-----------------------")
#result = calc(phones, COST_OF_PHONE)
result = calc(phones, 10.00, 400.00, 13, True)

print(result[["Phone Name","Price",r"Total Cost (50% off XMPP)","Total Cost"]])