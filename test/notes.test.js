process.env.NODE_ENV = "test";
mongoose = require("mongoose");
User = require('../api/models/user')

chai = require("chai")
chaiHttp =  require("chai-http");
server = require("../server");
should = chai.should();
let bcrypt = require("bcrypt");
let jwt = require("jwt-simple");
let config = require('../configs/'+ (process.env.NODE_ENV || "dev") + ".json");

chai.use(chaiHttp);

describe("Notes", () =>{

    let user_example = {
        firstname: "Gabriel",
        lastname: "Peres",
        username: "gabrielperes",
        password: bcrypt.hashSync("123321", 10),
        email: "gabriel@peres.com",
    }
    var user = null;

    //esvazia o banco a cada teste
    beforeEach((done) => {
        User.remove({}, (err) => {
            done();
        });
        user = new User(user_example);
        user.save();
    });

    describe("/GET note", () => {
        it("Listar todas as notas inseridas", (done) => {
            let notes_before= [
                {
                    title: "Materias",
                    content: "Portugues\nMatematica",
                    background_color: "#000",
                    font_color: "#FFF"
                },

                {
                    title: "Numeros",
                    content: "456789",
                    background_color: "#111",
                    font_color: "#EEE"
                },
                {
                    title: "Palavras",
                    content: "Olho, brinco",
                    background_color: "#222",
                    font_color: "#GGG"
                }
            ];
            notes_before.forEach(element => {
                user.notes.push(element);
            });
            user.save((err) => {
                //Realiza o login
                let payload = {id: user._id};
                let token = jwt.encode(payload, config.jwtSecret);
                chai.request(server)
                    .get("/note")
                    .set("authorization",token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.notes.should.be.a('array');
                        res.body.notes.length.should.be.eql(3);
                        for (var i=0; i<3; i++)
                        {
                            res.body.notes[i].should.have.property('title').eql(notes_before[i].title);
                            res.body.notes[i].should.have.property('content').eql(notes_before[i].content);
                            res.body.notes[i].should.have.property('background_color').eql(notes_before[i].background_color);
                            res.body.notes[i].should.have.property('font_color').eql(notes_before[i].font_color);
                            res.body.notes[i].should.have.property('created_date');
                        }
                    });
                done();
            });
        });
    });

    describe("/POST note", () => {
        it("Inserir uma nota", (done) => {
            //Realiza o login
            let payload = {id: user._id};
            let token = jwt.encode(payload, config.jwtSecret);

            let note = 
                [
                    {
                    title: "Datas",
                    content: "11/05/2037 - Não quero nem sabe com quantos anos eu vou chegar",
                    background_color: "#000",
                    font_color: "#FFF"
                    }
                ];

            chai.request(server)
                .post("/note")
                .set("authorization",token)
                .send(note)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].should.have.property('success').eql(true);
                    res.body[0].should.have.property('title').eql(note[0].title);
                    res.body[0].should.have.property('content').eql(note[0].content);
                    res.body[0].should.have.property('background_color').eql(note[0].background_color);
                    res.body[0].should.have.property('font_color').eql(note[0].font_color);
                    res.body[0].should.have.property('created_date');
                done();
                });
        });

        it("Inserir 3 notas", (done) => {
            //Realiza o login
            let payload = {id: user._id};
            let token = jwt.encode(payload, config.jwtSecret);

            let notes = [
                    {
                    title: "Datas",
                    content: "11/05/2037 - Não quero nem sabe com quantos anos eu vou chegar",
                    background_color: "#000",
                    font_color: "#FFF"
                    },

                    {
                        title: "A fazer",
                        content: "*Ir no banco\nIr no cabelereiro",
                        background_color: "#111",
                        font_color: "#EEE"
                    },
                    {
                        title: "Lembrete",
                        content: "Verificar site do banco",
                        background_color: "#222",
                        font_color: "#GGG"
                    }
                ];

            chai.request(server)
                .post("/note")
                .set("authorization",token)
                .send(notes)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                    for (var i=0; i<3; i++)
                    {
                        res.body[i].should.have.property('success').eql(true);
                        res.body[i].should.have.property('title').eql(notes[i].title);
                        res.body[i].should.have.property('content').eql(notes[i].content);
                        res.body[i].should.have.property('background_color').eql(notes[i].background_color);
                        res.body[i].should.have.property('font_color').eql(notes[i].font_color);
                        res.body[i].should.have.property('created_date');
                    }
                done();
                });
        });

        it("Inserir notas com o banco já contendo algumas", (done) => {
            let notes_before= [
                {
                    title: "Materias",
                    content: "Portugues\nMatematica",
                    background_color: "#000",
                    font_color: "#FFF"
                },

                {
                    title: "Numeros",
                    content: "456789",
                    background_color: "#111",
                    font_color: "#EEE"
                },
                {
                    title: "Palavras",
                    content: "Olho, brinco",
                    background_color: "#222",
                    font_color: "#GGG"
                }
            ];
            notes_before.forEach(element => {
                user.notes.push(element);
            });
            user.save((err) => {
                //Realiza o login
                let payload = {id: user._id};
                let token = jwt.encode(payload, config.jwtSecret);

                let notes = [
                        {
                            title: "Datas",
                            content: "11/05/2037 - Não quero nem sabe com quantos anos eu vou chegar",
                            background_color: "#000",
                            font_color: "#FFF"
                        },

                        {
                            title: "A fazer",
                            content: "*Ir no banco\nIr no cabelereiro",
                            background_color: "#111",
                            font_color: "#EEE"
                        },
                        {
                            title: "Lembrete",
                            content: "Verificar site do banco",
                            background_color: "#222",
                            font_color: "#GGG"
                        }
                    ];

                chai.request(server)
                    .post("/note")
                    .set("authorization",token)
                    .send(notes)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(3);
                        for (var i=0; i<3; i++)
                        {
                            res.body[i].should.have.property('success').eql(true);
                            res.body[i].should.have.property('title').eql(notes[i].title);
                            res.body[i].should.have.property('content').eql(notes[i].content);
                            res.body[i].should.have.property('background_color').eql(notes[i].background_color);
                            res.body[i].should.have.property('font_color').eql(notes[i].font_color);
                            res.body[i].should.have.property('created_date');
                        }
                    done();
                    });
            });
        });
    });
});