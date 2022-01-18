const {
  Given,
  When,
  Then,
  Before,
  After,
  AfterAll,
  BeforeAll,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const pactum = require("pactum");
const client = require("../../src/elastic/connection");
const dotenv = require("dotenv");
dotenv.config();

setDefaultTimeout(60 * 1000);

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lMDMiLCJlbWFpbCI6ImVtYWlsMDFAZ21haWwuY29tIiwiaWF0IjoxNjQyNDc1ODUxLCJleHAiOjE2NDI0Nzc2NTF9.cEt7_HYDT3zAwpsmuNvI-6qC9jrhk8v6NRsqK-z8lSM";
let id = "";

let spec = pactum.spec();

pactum.response.setDefaultExpectResponseTime(60000);

const index = process.env.INDEX_NAME;
const type = process.env.TYPE_NAME;

After({ tags: "@create" }, async () => {
  const res = await client.index({
    index: index,
    type: type,
    body: {
      username: "usercreate",
      password: "pass12345",
      email: "email01@gmail.com",
      status: 10,
    },
  });
  id = res.body["_id"];
});

Before(() => {
  spec = pactum.spec();
});

After({ tags: "@clear" }, async () => {
  const res = await client.deleteByQuery({
    index: index,
    type: type,
    body: {
      query: {
        match_all: {},
      },
    },
    wait_for_completion: true,
  });
  console.log(res.statusCode);
  // await pactum
  //   .spec()
  //   .delete("http://localhost:3003/api/users/delete-all")
  //   .withHeaders("authorization", token).wait;
});

AfterAll(async () => {
  await pactum
    .spec()
    .delete("http://localhost:3003/api/users/delete-all")
    .withAuth("username", "pass12345").wait;
});

//signup passed
Given(
  "I make a request signup to {string} with {}",
  async function (url, data) {
    data = JSON.parse(data);
    await spec.post(url).withBody(data).wait;
  }
);

When("I receive a response signup passed", async function () {
  await spec.toss();
});

Then(
  "response signup passed should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//signup missing
Given(
  "I make a request signup to {string} with {} ",
  async function (url, data) {
    data = JSON.parse(data);
    await spec.post(url).withBody(data).wait;
  }
);

When("I receive a response signup missing 1", async function () {
  await spec.toss();
});

Then(
  "response signup missing 1 should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//signup missing (duplicate)
Given(
  "I make a request signup to {string} with {} ",
  async function (url, data) {
    data = JSON.parse(data);
    await spec.post(url).withBody(data).wait;
  }
);

When("I receive a response signup missing 2", async function () {
  await spec.toss();
});

Then(
  "response signup missing 2 should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//login passed
Given(
  "I make a request login passed to {string} with {}",
  async function (url, data) {
    data = JSON.parse(data);
    await spec.post(url).withBody(data).wait;
  }
);

When("I receive a response login passed", async function () {
  await spec.toss();
});

Then(
  "response login passed should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//login missing
Given(
  "I make a request login missing to {string} with {}",
  async function (url, data) {
    data = JSON.parse(data);
    await spec.post(url).withBody(data).wait;
  }
);

When("I receive a response login missing", async function () {
  await spec.toss();
});

Then(
  "response login missing should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//create passed
Given(
  "I make a request create passed to {string} with {}",
  async function (url, data) {
    data = JSON.parse(data);
    await spec.post(url).withBody(data).withHeaders("authorization", token)
      .wait;
  }
);

When("I receive a response create passed", async function () {
  await spec.toss();
});

Then(
  "response create passed should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//create missing
Given(
  "I make a request create missing 1 to {string} with {}",
  async function (url, data) {
    data = JSON.parse(data);
    await spec.post(url).withBody(data).withHeaders("authorization", token)
      .wait;
  }
);

When("I receive a response create missing 1", async function () {
  await spec.toss();
});

Then(
  "response create missing 1 should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//create missing (duplicate)
Given(
  "I make a request create missing 2 to {string} with {}",
  async function (url, data) {
    data = JSON.parse(data);
    await spec.post(url).withBody(data).withHeaders("authorization", token)
      .wait;
  }
);

When("I receive a response create missing 2", async function () {
  await spec.toss();
});

Then(
  "response create missing 2 should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//get all user passed
Given("I make a request get all user passed to {string}", async function (url) {
  await spec.get(url).withHeaders("authorization", token).wait;
});

When("I receive a response get all user passed", async function () {
  await spec.toss();
});

Then(
  "response get all user passed should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//get all user missing
Given("No data exist", { timeout: 60 * 1000 }, async function () {
  const res = await client.deleteByQuery({
    index: index,
    type: type,
    body: {
      query: {
        match_all: {},
      },
    },
    wait_for_completion: true,
  });
  console.log(res.statusCode);
});

Given(
  "I make a request get all user missing to {string}",
  async function (url) {
    await spec.get(url).withHeaders("authorization", token).wait;
  }
);

When("I receive a response get all user missing", async function () {
  await spec.toss();
});

Then(
  "response get all user missing should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//get one user passed
Given("user id exist", { timeout: 60 * 1000 }, async function () {
  const res = await client.index({
    index: index,
    type: type,
    body: {
      username: "usercreate",
      password: "pass12345",
      email: "email01@gmail.com",
      status: 10,
    },
  });
  id = res.body["_id"];
});

Given("I make a request get one user passed to {string}", async function (url) {
  await spec.get(`${url}/${id}`).withHeaders("authorization", token).wait;
});

When("I receive a response get one user passed", async function () {
  await spec.toss();
});

Then(
  "response get one user passed should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//get one user missing
Given(
  "user id not exist I make a request get one user missing to {string}",
  async function (url) {
    await spec.get(`${url}/${"abc"}`).withHeaders("authorization", token).wait;
  }
);

When("I receive a response get one user missing", async function () {
  await spec.toss();
});

Then(
  "response get one user missing should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

//update one passed
Given("user id update exist", { timeout: 60 * 1000 }, async function () {
  const res = await client.index({
    index: index,
    type: type,
    body: {
      username: "usertest",
      password: "pass12345",
      email: "email01@gmail.com",
      status: 10,
    },
  });
  id = res.body["_id"];
});

Given(
  "I make a request update one user passed to {string} with {}",
  async function (url, data) {
    data = JSON.parse(data);
    await spec
      .put(`${url}/${id}`)
      .withBody(data)
      .withHeaders("authorization", token).wait;
  }
);

When("I receive a response update one user passed", async function () {
  await spec.toss();
});

Then(
  "response update one user passed should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);

// update one missing
Given(
  "user id update not exist I make a request update one user missing to {string} with {}",
  async function (url, data) {
    data = JSON.parse(data);
    await spec
      .put(`${url}/${"abc"}`)
      .withBody(data)
      .withHeaders("authorization", token).wait;
  }
);

When("I receive a response update one user missing", async function () {
  await spec.toss();
});

Then(
  "response update one user missing should have a status code {int}",
  async function (code) {
    await spec.response().should.have.status(code);
  }
);
