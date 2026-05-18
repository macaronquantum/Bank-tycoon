import { runTick } from './tickEngine';
setInterval(()=>runTick().catch(console.error),1000);
console.log('Simulation worker started');
