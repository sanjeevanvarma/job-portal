// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
// const Sentry = require("@sentry/node");
import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://ddc93aa637678b7b9cdbd9b052a5e273@o4509078927048704.ingest.us.sentry.io/4509078986817536",

  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],

  // Set sampling rate for profiling - this is evaluated only once per SDK.init
  
//   tracesSampleRate: 1.0,
});

Sentry.profiler.startProfiler();

Sentry.startSpan({
    name: 'My First Transaction',
}, () =>{

});


Sentry.profiler.stopProfiler();











// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
//const Sentry = require("@sentry/node");
// import * as Sentry from "@sentry/node"

// Sentry.init({
//   dsn: "https://ddc93aa637678b7b9cdbd9b052a5e273@o4509078927048704.ingest.us.sentry.io/4509078986817536",

//   // Set sampling rate for profiling - this is evaluated only once per SDK.init
//   profileSessionSampleRate: 1.0,
// });