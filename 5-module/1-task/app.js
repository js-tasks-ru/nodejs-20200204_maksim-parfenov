const Koa = require("koa");
const app = new Koa();
const path = require('path');
app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require("koa-router");

const router = new Router();

let clients = [];

router.get("/subscribe", async (ctx, next) => {

    ctx.set("Cache-Control", "no-cache,must-revalidate");
    const promise = new Promise((resolve, reject) => {
        clients.push(resolve);

        ctx.res.on("close", function () {
            clients.splice(clients.indexOf(resolve), 1);
            const error = new Error("Connection closed");
            error.code = "ECONNRESET";
            reject(error);
        });

    });

    let message;

    try {
        message = await promise;
    } catch (err) {
        if (err.code === "ECONNRESET") return;
        throw err;
    }

    // console.log('DONE', message);
    ctx.body = message;

});

router.post("/publish", async (ctx, next) => {
    const message = ctx.request.body.message;

    if (!message) {
        ctx.throw(400);
    }

    clients.forEach(function (resolve) {
        resolve(String(message));
    });

    clients = [];

    ctx.body = "ok";

});

app.use(router.routes());
module.exports = app;