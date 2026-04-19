import mongoose from "mongoose";

const connectString = "mongodb://localhost:27017/shopDEV";

const testSchema = new mongoose.Schema({
  name: String,
});

const testModel = mongoose.model("Test", testSchema);

describe("MongoDB testing", () => {
  let connection: mongoose.Mongoose;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("Should connect successfully", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("Should save a document successfully", async () => {
    const newUser = new testModel({ name: "Khai" });

    await newUser.save();

    expect(newUser.isNew).toBe(false);
  });

  it("Should find a document successfully", async () => {
    const user = await testModel.findOne({ name: "Khai" });

    expect(user).toBeDefined();
    expect(user?.name).toBe("Khai");
  });
});
