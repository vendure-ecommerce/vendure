---
title: "Taxes"
---

# Taxes

Taxes represent extra charges on top of the base price of a product. There are various forms of taxes that might be applicable, depending on local laws and the laws of the regions that your business serves. Common forms of applicable taxes are:

* Value added tax (VAT)
* Goods and services tax (GST)  
* Sales taxes (as in the USA)


## Tax Category

In Vendure every product variant is assigned a **tax category**. In many countries, different rates of tax apply depending on the type of product being sold.

For example, in the UK there are three rates of VAT:

* Standard rate (20%)
* Reduced rate (5%)
* Zero rate (0%)

Most types of product would fall into the "standard rate" category, but for instance books are classified as "zero rate".

## Tax Rate

Tax rates set the rate of tax for a given **tax category** destined for a particular **zone**. They are used by default in Vendure when calculating all taxes.

## Tax Compliance

Please note that tax compliance is a complex topic that varies significantly between countries. Vendure does not (and cannot) offer a complete out-of-the box tax solution which is guaranteed to be compliant for your use-case. What we strive to do is to provide a very flexible set of tools that your developers can use to tailor tax calculations exactly to your needs. These are covered in the [Developer's guide to taxes]({{< relref "/docs/developer-guide/taxes" >}}). 
