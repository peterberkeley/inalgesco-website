/* Fleet savings calculator, shared by index.html and evidence.html.
   Diesel prices and exchange-rate conversions live in REGIONS below; when
   refreshing them, also update the dated sources in each page's calc__note. */
/* Savings calculator. Four-stream model, regional diesel prices and local currency. */
(function(){
  var $=function(id){return document.getElementById(id);};
  if(!$('savings-calculator')) return;
  var L_PER_GAL=3.78541, GAL_PER_HR=1.25;
  var US={cur:'USD', loc:'en-US', unit:'gal', price:5.97, maint:8700, ice:2000, disrupt:2000, chillrail:850, word:'US dollars'};
  var REGIONS={
    '':           {name:'US',          cur:'USD', loc:'en-US', unit:'gal', price:5.97, maint:8700,  ice:2000, disrupt:2000, chillrail:850,  word:'US dollars', basis:'average'},
    'usa':        {name:'US',          cur:'USD', loc:'en-US', unit:'gal', price:5.97, maint:8700,  ice:2000, disrupt:2000, chillrail:850,  word:'US dollars', basis:'average'},
    'canada':     {name:'Canadian',    cur:'CAD', loc:'en-GB', unit:'L',   price:2.51, maint:12100, ice:2800, disrupt:2800, chillrail:1180, word:'Canadian dollars', basis:'average'},
    'uk':         {name:'UK',          cur:'GBP', loc:'en-GB', unit:'L',   price:1.86, maint:6400,  ice:1500, disrupt:1500, chillrail:630,  word:'pounds sterling', basis:'average'},
    'europe':     {name:'Euro area',   cur:'EUR', loc:'en-IE', unit:'L',   price:2.14, maint:7500,  ice:1700, disrupt:1700, chillrail:736,  word:'euros', basis:'average'},
    'middle-east':{name:'Middle East', cur:'USD', loc:'en-GB', unit:'L',   price:0.59, maint:8700,  ice:2000, disrupt:2000, chillrail:850,  word:'US dollars', basis:'typical price'},
    'far-east':   {name:'Far East',    cur:'USD', loc:'en-GB', unit:'L',   price:1.30, maint:8700,  ice:2000, disrupt:2000, chillrail:850,  word:'US dollars', basis:'typical price'},
    'australasia':{name:'Australian',  cur:'AUD', loc:'en-GB', unit:'L',   price:2.53, maint:12200, ice:2800, disrupt:2800, chillrail:1192, word:'Australian dollars', basis:'average'}
  };
  var R=REGIONS[''], custom=false, fmt, sym;
  function setCurrency(){
    fmt=new Intl.NumberFormat(R.loc,{style:'currency',currency:R.cur,maximumFractionDigits:0});
    sym=(fmt.formatToParts(0).filter(function(p){return p.type==='currency';})[0]||{value:'$'}).value;
    [].forEach.call(document.querySelectorAll('#savings-calculator .calc__cur'),function(el){ el.textContent=sym; });
    $('calc-cur-note').textContent='Figures in '+R.word+'.';
  }
  function update(){
    var pos=function(id){ var v=+$(id).value; return v>0?v:0; };   /* blanks and negatives count as zero */
    var t=+$('calc-trucks').value, p=pos('calc-diesel-num'), h=+$('calc-hours').value, d=+$('calc-days').value;
    var own=pos('calc-maint')+pos('calc-ice')+pos('calc-disrupt');
    var galYr=GAL_PER_HR*h*d, fuelYr=(R.unit==='gal')?galYr:galYr*L_PER_GAL;
    var per=(h>0&&d>0)?fuelYr*p+own-R.chillrail:0;   /* a truck that never runs saves nothing */
    $('calc-trucks-out').textContent=t;
    $('calc-hours-out').textContent=h;
    $('calc-days-out').textContent=d;
    $('calc-total').textContent=fmt.format(per*t);
    $('calc-per-truck').textContent=fmt.format(per);
    $('calc-five').textContent=fmt.format(per*t*5);
    $('calc-fuel').textContent=Math.round(fuelYr*t).toLocaleString('en-US')+(R.unit==='gal'?' US gal':' litres');
    var fresh=!custom&&!$('calc-region').value&&!p;
    $('calc-diesel-hint').textContent=fresh?'Choose your region, or enter your own price':(!p?'Enter a diesel price above zero':(custom?'Your figure':R.name+' '+R.basis+', week of 7 September 2026'));
  }
  function applyRegion(){
    var s=$('calc-diesel'), key=$('calc-region').value, price;
    R=REGIONS[key]||REGIONS['']; custom=false;
    price=key?R.price:0;                      /* no region chosen: the diesel bar starts at zero */
    s.min=0; s.max=(R.price*2.5).toFixed(2); s.value=price;
    $('calc-diesel-num').value=price.toFixed(2);
    $('calc-maint').value=R.maint; $('calc-ice').value=R.ice; $('calc-disrupt').value=R.disrupt;
    $('calc-diesel-label').textContent='Diesel price, per '+(R.unit==='gal'?'US gallon':'litre');
    setCurrency(); update();
  }
  $('calc-region').addEventListener('change',applyRegion);
  $('calc-diesel').addEventListener('input',function(){ $('calc-diesel-num').value=(+this.value).toFixed(2); custom=true; update(); });
  $('calc-diesel-num').addEventListener('input',function(){
    var v=+this.value, s=$('calc-diesel');
    if(v>0) s.value=Math.min(Math.max(v,+s.min),+s.max);
    custom=true; update();
  });
  ['calc-trucks','calc-hours','calc-days','calc-maint','calc-ice','calc-disrupt'].forEach(function(id){ $(id).addEventListener('input',update); });
  applyRegion();
})();
