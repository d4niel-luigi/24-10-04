import { Controller, Get, Render, Post, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { newAccountDto } from './newAccount.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  #accounts = [
    {
      name: 'Gál Dániel',
      billingaddress: 'Magyarország, 1185, Budapest, Lugos utca 14.',
      shippingaddress: 'Magyarország, 1185, Budapest, Lugos utca 14.',
      coupon: 'KK-1234',
      cardnumber: '1234-5678-9101-1121', expiration: '06/30', security: '736',
    },
    {
      name: 'Kis Pista',
      billingaddress: 'Magyarország, 1047, Budapest, Thököly út 55-58.',
      shippingaddress: 'Magyarország, 1047, Budapest, Thököly út 55-58.',
      coupon: '',
      cardnumber: '2415-5457-2346-8657',
      expiration: '01/24',
      security: '356',
    },
    {
      name: 'Beviz Elek',
      billingaddress: 'Magyarország, 4031, Debrecen, Ács utca 13.  ',
      shippingaddress: 'Magyarország, 4031, Debrecen, Ács utca 13. ',
      coupon: 'PT-2145',
      cardnumber: '2135-4312-2146-7756', expiration: '11/27', security: '851',
    }
  ]

  @Get('newAccount')
  @Render('newAccountForm')
  newAccountForm(){
 
  }


  @Post('newAccount')
  newAccount(
    @Body() accountData: newAccountDto,
    @Res() response: Response
  ) {
    let errors: string[] = [];
    if (!/^\d{4}-\d{4}$/.test(accountData.cardnumber)) {
      errors.push('A bankártyaszám nem megfelelő formátumú!')
    }
    if (!/^\d{2}-\d{4}$/.test(accountData.coupon)) {
      errors.push('A kupon nem megfelelő formátumú!')
    }
    if(!/^\d{2}\/d{2}$/.test(accountData.expiration) || this.isExpired(accountData.expiration)) {
      errors.push('A lejárati dátum már lejárt!')
    }
    if (!accountData.name || !accountData.billingaddress || !accountData.shippingaddress || !accountData.coupon || !accountData.cardnumber || !accountData.expiration || !accountData.security) {
      errors.push("Minden mezőt kötelező megadni!");
    }
    let newAccount = {
      name: accountData.name,
      billingaddress: accountData.billingaddress,
      shippingaddress: accountData.shippingaddress,
      coupon: accountData.coupon,
      cardnumber: accountData.cardnumber,
      expiration: accountData.expiration,
      security: accountData.security,
    }
    this.#accounts.push(newAccount)
    // 303 -> /newAccountSuccess
    response.redirect(303, '/newAccountSuccess');
   
  }
  @Get('newAccountSuccess ')
  @Render('success')
  newAccountSuccess(){
   
    return{
      accounts: this.#accounts.length
    }
  }


  private isExpired(expiration: string): boolean {

    const [month, year] = expiration.split('/').map(num => parseInt(num));
    const now = new Date();
    const expiry = new Date(2000 + year, month -1 );
    return expiry < now ;
  }
}
