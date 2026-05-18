import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const countries = [
['Reguloria','RGL'],['Liberalis','LBR'],['Emergia','EMG'],['Volatilia','VLT'],['Finhuba','FHB'],['Taxhavenia','TXH'],['Middland','MDL'],['Neotera','NEO']
];
async function main(){
 for(const [name,code] of countries){
  const c = await prisma.country.upsert({where:{code},update:{},create:{name,code,currency:code,stability:50,regulation:50,inflation:3,baseRate:2,capitalMin:8,liquidityMin:10,concentrationLimit:35,marketExposureLimit:40,interbankLimit:30,licenseSpeed:50,complianceCost:10000}});
  for(let i=1;i<=5;i++){
   const city=await prisma.city.create({data:{countryId:c.id,name:`${name} City ${i}`,population:500000+i*10000,avgIncome:30000+i*4000,unemployment:5+i*0.2,growth:2+i*0.3}});
   for(let j=1;j<=8;j++) await prisma.district.create({data:{countryId:c.id,cityId:city.id,name:`District ${i}-${j}`,wealth:40+j*6,realEstateCost:500+j*130,competition:30+j*4,crimeRisk:20+j*2,depositPotential:200000+j*30000,loanPotential:120000+j*25000,segments:{popular:1,middle:1,premium:j>4?1:0}}});
  }
 }
 await prisma.marketInstrument.createMany({data:[
  {name:'Central Reserves',category:'RESERVE',baseYield:0.01,volatility:0.01,liquidity:1,riskWeight:0.01},
  {name:'Gov Bond ST',category:'BOND',baseYield:0.02,volatility:0.05,liquidity:0.9,riskWeight:0.1},
  {name:'Corp Bond',category:'BOND',baseYield:0.04,volatility:0.12,liquidity:0.7,riskWeight:0.4},
  {name:'Equities',category:'EQUITY',baseYield:0.06,volatility:0.25,liquidity:0.7,riskWeight:0.8}
 ]});
 await prisma.season.create({data:{name:'Season 1',startsAt:new Date(),endsAt:new Date(Date.now()+14*86400000),active:true}});
}
main().finally(()=>prisma.$disconnect());
