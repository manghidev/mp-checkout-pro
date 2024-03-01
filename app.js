var express = require('express');
var exphbs = require('express-handlebars');

const { MercadoPagoConfig, Preference } = require('mercadopago');

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    const params = req.query;

    const client = new MercadoPagoConfig({
        accessToken: 'APP_USR-2926550097213535-092911-5eded40868803c83f12e9eef1afa99fa-1160956296',
        integratorId: 'dev_24c65fb163bf11ea96500242ac130004',
    });

    const preference = new Preference(client);

    preference.create({
        body: {
            payment_methods: {
                excluded_payment_methods: [
                    {
                        id: "visa",
                    },
                ],
                excluded_payment_types: [],
                installments: 6,
            },
            back_urls: {
                success: "http://localhost:3000/response/success",
                failure: "http://localhost:3000/response/failure",
                pending: "http://localhost:3000/response/pending",
            },
            notification_url: "http://localhost:3000/webhook",
            auto_return: "approved",
            payer: {
                name: "Lalo",
                surname: "Landa",
                email: "test_user_94708656@testuser.com",
                phone: {
                    area_code: "614",
                    number: 5226985,
                },
                address: {
                    street_name: "calle falsa",
                    street_number: 123,
                    zip_code: "31000",
                },
            },
            external_reference: "calipso.cuerpos.0i@icloud.com",
            items: [
                {
                    title: params.title,
                    quantity: parseInt(params.unit),
                    unit_price: parseFloat(params.price),
                    currency_id: "MXN",
                    id: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
                    description: "Dispositivo móvil de Tienda e-commerce",
                    picture_url: "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
                },
            ],
        }
    }).then((response) => {
        res.render('detail', { ...req.query, id: response.id });
    }).catch((error) => {
        console.log(error);
        res.redirect('/');
    });
});

app.get('/response/:page', function (req, res) {
    const params = req.query;

    res.render('response', { ...params, page: req.params.page });
});

app.post('/webhook', function (req, res) {
    console.log('webhook: ', req.body, req.query);
    res.status(200).send('OK');
});

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));