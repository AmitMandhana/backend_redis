// import cors from 'cors';
// import express, {Express} from 'express';
// import { setupSwagger } from './docs/swagger';

// import userRouter from './apis/routes/user.route';
// import uploadRouter from './apis/routes/upload.route';
// import customerRouter from './apis/routes/customers.route';
// import orderRouter from './apis/routes/orders.route';
// import campaignRouter from './apis/routes/campaign.route';
// import segmentRulesRouter from './apis/routes/segmentRules.route';
// import statusRouter from './apis/routes/status.route';

// const app: Express = express();

// // Wide-open CORS for all routes, including preflights
// app.use(cors({
//     origin: (origin, callback) => callback(null, true),
//     credentials: true,
//     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
// }));
// // In Express v5, wildcard '*' in path patterns is not supported by path-to-regexp.
// // Preflight requests are already handled by the cors middleware above.
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Relax COOP/COEP so auth popups (e.g., Google) can interact with opener
// app.use((req, res, next) => {
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
//     res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
//     next();
// });

// app.use("/api/users",userRouter)
// app.use("/api/uploads", uploadRouter)
// app.use("/api/customers", customerRouter)
// app.use("/api/orders", orderRouter)
// app.use("/api/campaigns", campaignRouter)
// app.use("/api/segmentRules", segmentRulesRouter)
// app.use("/api/status", statusRouter)

// setupSwagger(app);

// export default app;






// import cors from 'cors';
// import express, {Express} from 'express';
// import { setupSwagger } from './docs/swagger';

// import userRouter from './apis/routes/user.route';
// import uploadRouter from './apis/routes/upload.route';
// import customerRouter from './apis/routes/customers.route';
// import orderRouter from './apis/routes/orders.route';
// import campaignRouter from './apis/routes/campaign.route';
// import segmentRulesRouter from './apis/routes/segmentRules.route';
// import statusRouter from './apis/routes/status.route';

// const app: Express = express();

// // CORS configuration with specific allowed origins for production
// app.use(cors({
//     origin: (origin, callback) => {
//         const allowedOrigins = [
//             'https://frontend-xeno-bnaa.vercel.app/',
//             'https://amitminicrm.vercel.app',
//             'http://localhost:3000',
//             'http://localhost:8000'
//         ];
//         // Allow requests with no origin (like mobile apps, curl requests)
//         if (!origin) return callback(null, true);
        
//         if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
//             callback(null, true);
//         } else {
//             console.log('CORS blocked request from:', origin);
//             callback(null, true); // Still allow for now, but log it
//         }
//     },
//     credentials: true,
//     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
// }));
// // In Express v5, wildcard '*' in path patterns is not supported by path-to-regexp.
// // Preflight requests are already handled by the cors middleware above.
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Relax COOP/COEP so auth popups (e.g., Google) can interact with opener
// app.use((req, res, next) => {
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
//     res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
//     next();
// });

// app.use("/api/users",userRouter)
// app.use("/api/uploads", uploadRouter)
// app.use("/api/customers", customerRouter)
// app.use("/api/orders", orderRouter)
// app.use("/api/campaigns", campaignRouter)
// app.use("/api/segmentRules", segmentRulesRouter)
// app.use("/api/status", statusRouter)

// setupSwagger(app);

// export default app;



import cors from 'cors';
import express, { Express } from 'express';
import { setupSwagger } from './docs/swagger';

import userRouter from './apis/routes/user.route';
import uploadRouter from './apis/routes/upload.route';
import customerRouter from './apis/routes/customers.route';
import orderRouter from './apis/routes/orders.route';
import campaignRouter from './apis/routes/campaign.route';
import segmentRulesRouter from './apis/routes/segmentRules.route';
import statusRouter from './apis/routes/status.route';

const app: Express = express();

// ✅ Allow everything via CORS
app.use(cors({
    origin: "*", // allow all origins
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Fix Google OAuth popup issue (allow postMessage between popup and parent)
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});

// ✅ Routes
app.use("/api/users", userRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/campaigns", campaignRouter);
app.use("/api/segmentRules", segmentRulesRouter);
app.use("/api/status", statusRouter);

// ✅ Swagger docs
setupSwagger(app);

export default app;
