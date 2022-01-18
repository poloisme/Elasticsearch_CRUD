const handleJWT = require("../src/utils/handleJWT");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

const tokenTest = "token";
const secretTest = "mySecretKey";
const timeExpTest = "30m";

const dataTest = {
  username: "username",
  password: "pass12345",
};

afterAll(async () => {
  jest.resetAllMocks();
});

describe("enCodedToken passed", () => {
  beforeEach(() => {
    jwt.sign.mockReturnValue(tokenTest);
  });
  test("should response a result success", async () => {
    const result = await handleJWT.enCodedToken(
      dataTest,
      secretTest,
      timeExpTest
    );
    expect(result).toBe(tokenTest);
  });
});

describe("enCodedToken missing", () => {
  beforeEach(() => {
    jwt.sign.mockImplementation(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await handleJWT.enCodedToken(dataTest, secretTest, timeExpTest);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("JWT error");
  });
});

describe("deCodedToken passed", () => {
  beforeEach(() => {
    jwt.verify.mockReturnValue({
      ...dataTest,
    });
  });
  test("should response a result success", async () => {
    const result = await handleJWT.deCodedToken(tokenTest, secretTest);
    expect(result).toHaveProperty("username", dataTest.username);
    expect(result).toHaveProperty("password", dataTest.password);
  });
});

describe("deCodedToken missing", () => {
  beforeEach(() => {
    jwt.verify.mockImplementation(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await handleJWT.deCodedToken(tokenTest, secretTest);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("JWT error");
  });
});
