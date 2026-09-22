const path=require('path');
require('dotenv').config({path:path.join(__dirname,'.env')});
const express=require('express');
const session=require('express-session');
const MongoStore=require('connect-mongo').default;
const helmet=require('helmet');
const compression=require('compression');
const rateLimit=require('express-rate-limit');
const {connectDatabase}=require('./config/database');
const store=require('./config/store');
const {formatMoney}=require('./utils/money');
const {csrfToken,globalCsrf}=require('./middleware/csrf');
const {notFound,errorHandler}=require('./middleware/errorHandler');

if(!process.env.SESSION_SECRET)throw new Error('SESSION_SECRET is not set.');
if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI is not set.');
const app=express();
app.set('view engine','ejs');app.set('views',path.join(__dirname,'views'));
app.locals.store=store;
app.locals.formatMoney=formatMoney;
app.locals.siteOrigin=String(process.env.SITE_ORIGIN||'http://localhost:3000').replace(/\/$/,'');
app.locals.assetVersion='lite-2';
app.locals.safeAssetUrl=value=>String(value||'');
app.locals.responsiveImageUrl=(value)=>String(value||'');
app.locals.settings={
  store:{name:store.name,tagline:'A considered wardrobe. A point of view.',description:store.description,branding:{showName:true,showTagline:false,showLogo:false}},
  currency:{code:store.currency,symbol:store.currencySymbol,position:'before'},
  appearance:{
    colors:{primary:'#20221f',secondary:'#414840',accent:'#793c30',pageBackground:'#fcfcfa',sectionBackground:'#f0f1ed',cardBackground:'#ffffff',mainText:'#20221f',secondaryText:'#63675f',border:'#d5d8d0',buttonBackground:'#20221f',buttonText:'#fcfcfa',footerBackground:'#20251f',footerText:'#f6f7f0'},
    typography:{headingFont:'Cormorant Garamond, Georgia, serif',bodyFont:'Jost, Arial, sans-serif',baseFontSize:16,headingPreset:'cormorant'},
    buttons:{radius:'4px'},cards:{radius:'4px'},forme:{brandStyle:'editorial',colorMode:'light',contentWidth:'standard',spacingDensity:'balanced',productImageRatio:'portrait45'}
  }
};
app.set('trust proxy',process.env.NODE_ENV==='production'?1:false);
app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'"],imgSrc:["'self'",'data:'],objectSrc:["'none'"],baseUri:["'self'"],formAction:["'self'"]}}}));
app.use(compression());
app.use(express.static(path.join(__dirname,'public'),{maxAge:process.env.NODE_ENV==='production'?'7d':0}));
app.use(express.urlencoded({extended:false,limit:'1mb'}));
app.use(express.json({limit:'1mb'}));
app.use(session({store:MongoStore.create({mongoUrl:process.env.MONGODB_URI,collectionName:'sessions',ttl:14*24*60*60}),secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:14*24*60*60*1000}}));
app.use(csrfToken);
app.use(globalCsrf);
app.use((req,res,next)=>{res.locals.path=req.path;res.locals.pageTitle=res.locals.pageTitle||store.name;next();});
app.get('/robots.txt',(req,res)=>res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin/\n'));
app.use('/api',rateLimit({windowMs:60*1000,max:120,standardHeaders:true,legacyHeaders:false}),require('./routes/orders'));
app.use('/admin',rateLimit({windowMs:60*1000,max:180,standardHeaders:true,legacyHeaders:false}),require('./routes/admin'));
app.use(require('./routes/storefront'));
app.use(notFound);app.use(errorHandler);
async function start(){await connectDatabase();const port=Number(process.env.PORT||3000);app.listen(port,()=>console.log(`FORME Lite running at http://localhost:${port}`));}
start().catch(error=>{console.error('Startup failed:',error.message);process.exit(1);});
